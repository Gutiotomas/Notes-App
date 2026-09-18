"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const allTables = await queryInterface.showAllTables();
    const tableNames = allTables.map((t) =>
      (typeof t === "string" ? t : t.tableName || "").toLowerCase(),
    );

    const hasTable = (name) => tableNames.includes(name.toLowerCase());

    if (!hasTable("users")) {
      await queryInterface.createTable("users", {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
      });
    } else {
      // 20250415195316-init-schema created users.id as a SIGNED int, while the
      // User model and every userId foreign key below use INTEGER UNSIGNED.
      // MySQL requires both sides of a foreign key to match exactly, signedness
      // included, so leaving them out of step makes the createTable calls below
      // fail with "Referencing column 'userId' and referenced column 'id' ...
      // are incompatible" and a fresh install never gets past this migration.
      const usersTable = await queryInterface.describeTable("users");
      const isSigned = !String(usersTable.id?.type || "")
        .toUpperCase()
        .includes("UNSIGNED");

      // Only safe while nothing references users.id yet: MySQL refuses to change
      // the signedness of a column that a live foreign key points at. When those
      // tables already exist the database is self-consistent already (MySQL
      // enforced it when they were created), so it is left untouched.
      if (isSigned && !hasTable("categories") && !hasTable("notes")) {
        // Raw DDL rather than changeColumn: the latter re-issues PRIMARY KEY and
        // MySQL rejects defining it twice.
        await queryInterface.sequelize.query(
          "ALTER TABLE `users` MODIFY `id` INT UNSIGNED NOT NULL AUTO_INCREMENT",
        );
      }
    }

    // Whatever users.id ended up being, the foreign keys must mirror it exactly.
    // Reading it back covers databases this migration is not allowed to alter.
    const usersDescription = await queryInterface.describeTable("users");
    const userIdType = String(usersDescription.id?.type || "")
      .toUpperCase()
      .includes("UNSIGNED")
      ? Sequelize.INTEGER.UNSIGNED
      : Sequelize.INTEGER;

    if (!hasTable("categories")) {
      await queryInterface.createTable("categories", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        userId: {
          type: userIdType,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      });
    }

    if (!hasTable("notes")) {
      await queryInterface.createTable("notes", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: userIdType,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        value: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
        },
        archived: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      });
    } else {
      const notesTable = await queryInterface.describeTable("notes");

      if (!notesTable.value) {
        await queryInterface.addColumn("notes", "value", {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
        });
      }

      if (!notesTable.archived) {
        await queryInterface.addColumn("notes", "archived", {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        });
      }
    }

    if (!hasTable("note_categories")) {
      await queryInterface.createTable("note_categories", {
        noteId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "notes",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        categoryId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "categories",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      });

      await queryInterface.addConstraint("note_categories", {
        fields: ["noteId", "categoryId"],
        type: "primary key",
        name: "pk_note_categories",
      });
    }
  },

  down: async () => {
    // Intentionally empty: we avoid destructive rollback in production environments.
  },
};
