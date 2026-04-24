"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable("notes");

    if (!columns.installments) {
      await queryInterface.addColumn("notes", "installments", {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      });
    }
  },

  async down(queryInterface) {
    const columns = await queryInterface.describeTable("notes");

    if (columns.installments) {
      await queryInterface.removeColumn("notes", "installments");
    }
  },
};
