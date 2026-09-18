"use strict";

/**
 * Adds the missing foreign keys from categories.userId and notes.userId to
 * users.id.
 *
 * Databases built by sync({ alter: true }) ended up with users.id as INT
 * UNSIGNED but both userId columns as a signed INT. MySQL refuses a foreign key
 * whose sides differ in signedness, so those two constraints were silently
 * never created: deleting a user left their notes and categories orphaned,
 * and nothing stopped a row pointing at a user that does not exist.
 *
 * This migration aligns the column types and then creates the constraints.
 * Every step is guarded, so running it against a database that is already
 * correct is a no-op.
 */

const TABLES = ["categories", "notes"];

const isUnsigned = (columnType) =>
  String(columnType || "")
    .toUpperCase()
    .includes("UNSIGNED");

const findUserForeignKey = async (sequelize, table) => {
  const [rows] = await sequelize.query(
    `SELECT CONSTRAINT_NAME AS name
       FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = '${table}'
        AND COLUMN_NAME = 'userId'
        AND REFERENCED_TABLE_NAME = 'users'`,
  );
  return rows.length > 0 ? rows[0].name : null;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize;

    const usersTable = await queryInterface.describeTable("users");
    const usersIdUnsigned = isUnsigned(usersTable.id && usersTable.id.type);
    const columnDefinition = usersIdUnsigned
      ? "INT UNSIGNED NOT NULL"
      : "INT NOT NULL";

    // Check every table for rows pointing at a missing user BEFORE touching the
    // schema. A foreign key cannot be created over orphaned rows, and failing
    // here leaves the database exactly as it was found.
    for (const table of TABLES) {
      const [orphans] = await sequelize.query(
        `SELECT DISTINCT t.userId AS userId
           FROM \`${table}\` t
           LEFT JOIN users u ON u.id = t.userId
          WHERE u.id IS NULL`,
      );

      if (orphans.length > 0) {
        const ids = orphans.map((row) => row.userId).join(", ");
        throw new Error(
          `Cannot add the foreign key on ${table}.userId: rows reference users ` +
            `that do not exist (userId: ${ids}). Reassign or delete those rows, ` +
            `then run this migration again. No changes were made.`,
        );
      }
    }

    for (const table of TABLES) {
      const description = await queryInterface.describeTable(table);
      const columnIsUnsigned = isUnsigned(
        description.userId && description.userId.type,
      );

      // Raw DDL rather than changeColumn, which would also try to re-apply
      // indexes and defaults this migration has no business rewriting.
      if (columnIsUnsigned !== usersIdUnsigned) {
        await sequelize.query(
          `ALTER TABLE \`${table}\` MODIFY \`userId\` ${columnDefinition}`,
        );
      }

      const existing = await findUserForeignKey(sequelize, table);
      if (!existing) {
        await queryInterface.addConstraint(table, {
          fields: ["userId"],
          type: "foreign key",
          name: `fk_${table}_userId`,
          references: { table: "users", field: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        });
      }
    }
  },

  down: async (queryInterface) => {
    const sequelize = queryInterface.sequelize;

    // Only drops the constraints. The column types are deliberately left
    // aligned with users.id: reverting them would re-break any foreign key and
    // gains nothing.
    for (const table of TABLES) {
      const existing = await findUserForeignKey(sequelize, table);
      if (existing) {
        await queryInterface.removeConstraint(table, existing);
      }
    }
  },
};
