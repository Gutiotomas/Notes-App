import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from a .env file into process.env
dotenv.config();

// Initialize Sequelize instance with database configuration
export const sequelize = new Sequelize({
  dialect: "mysql", // Specify the database dialect (MySQL in this case)
  host: process.env.DB_HOST, // Database host from environment variables
  database: process.env.DB_NAME, // Database name from environment variables
  username: process.env.DB_USER, // Database username from environment variables
  password: process.env.DB_PASSWORD, // Database password from environment variables
  port: parseInt(process.env.DB_PORT || "3306"), // Database port, defaulting to 3306 if not provided
  logging: false, // Disable SQL query logging
  models: [path.resolve(__dirname, "../models")], // Path to the models directory
});

// Immediately invoked async function to handle database connection and synchronization
(async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log("✅ Database connection successfully established.");

    // Synchronize models with the database, altering tables if necessary
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized successfully.");
  } catch (error) {
    // Log any errors that occur during connection or synchronization
    console.error("❌ Error connecting or synchronizing the database:", error);
  }
})();
