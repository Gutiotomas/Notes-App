import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
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

// sync({ alter: true }) rewrites the live schema from the models, and Sequelize
// DROPS any column that no longer appears in a model (see its Model.sync: a
// column with no matching attribute is passed to removeColumn). That is data
// loss with no confirmation, so it must never be the default.
//
// Schema changes belong in migrations, which are explicit and reviewable:
//   npm run migrate
//
// This is opt-in and off unless DB_SYNC is literally "true". It used to be on
// unless NODE_ENV happened to be "production", which meant any deployment that
// forgot that one variable silently ran destructive DDL on every boot.
const shouldSyncDatabase = process.env.DB_SYNC === "true";

// Connect (and optionally sync) before the caller starts accepting requests.
// Previously this ran as a floating async IIFE, so the server could begin
// serving traffic while ALTER TABLE statements were still in flight.
export const initializeDatabase = async () => {
  await sequelize.authenticate();
  console.log("✅ Database connection successfully established.");

  if (!shouldSyncDatabase) {
    console.log("ℹ️  Schema sync disabled (set DB_SYNC=true to enable).");
    return;
  }

  console.warn(
    "⚠️  DB_SYNC=true: altering the schema to match the models. This can drop columns — never use it against production data.",
  );
  await sequelize.sync({ alter: true });
  console.log("✅ Database synchronized successfully.");
};
