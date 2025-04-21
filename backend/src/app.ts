import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sequelize } from "./config/db";
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import categoryRoutes from "./routes/categoryRoutes";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Retrieve the PORT from environment variables
const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("PORT environment variable is not defined");
}

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define routes for different functionalities
app.use("/auth", authRoutes); // Routes for authentication
app.use("/notes", noteRoutes); // Routes for managing notes
app.use("/categories", categoryRoutes); // Routes for managing categories

// Function to start the server and connect to the database
const startServer = async () => {
  try {
    // Authenticate the database connection
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`🌐 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // Log an error if the database connection fails
    console.error("❌ Database connection failed:", error);
  }
};

// Start the server
startServer();
