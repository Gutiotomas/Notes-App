"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Provide sensible defaults if env vars are missing
    const seedName = process.env.SEED_USER_NAME || "admin";
    const seedEmail = process.env.SEED_USER_EMAIL || "admin@example.com";
    const seedPassword = process.env.SEED_USER_PASSWORD || "admin1234";

    // Check if a user with the seed email already exists to make the seeder idempotent
    const existingId = await queryInterface.rawSelect(
      "users",
      { where: { email: seedEmail } },
      "id",
    );

    if (existingId) {
      console.log(
        `Seed user with email ${seedEmail} already exists (id=${existingId}), skipping insert.`,
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(seedPassword, 10);
    await queryInterface.bulkInsert("users", [
      {
        name: seedName,
        email: seedEmail,
        password: hashedPassword,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
