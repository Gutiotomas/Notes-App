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
    }

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
          type: Sequelize.INTEGER.UNSIGNED,
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
          type: Sequelize.INTEGER.UNSIGNED,
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
