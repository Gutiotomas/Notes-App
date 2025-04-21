'use strict';

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash(process.env.SEED_USER_PASSWORD, 10);
    await queryInterface.bulkInsert("users", [
      {
        name: process.env.SEED_USER_NAME,
        email: process.env.SEED_USER_EMAIL,
        password: hashedPassword,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};