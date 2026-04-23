import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";
import models from "../models";

// Load environment variables from a .env file into process.env
dotenv.config();

// Initialize Sequelize instance with database configuration
export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "3306"),
  logging: false,
});

// Register models explicitly to ensure they are initialized before use
sequelize.addModels(models as any);

const shouldSyncDatabase = process.env.NODE_ENV !== "production";

// Immediately invoked async function to handle database connection and synchronization
(async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log("✅ Database connection successfully established.");

    if (shouldSyncDatabase) {
      // Synchronize models with the database, altering tables if necessary
      await sequelize.sync({ alter: true });
      console.log("✅ Database synchronized successfully.");
    } else {
      console.log("✅ Database synchronization skipped in production.");
    }
  } catch (error) {
    // Log any errors that occur during connection or synchronization
    console.error("❌ Error connecting or synchronizing the database:", error);
  }
})();
