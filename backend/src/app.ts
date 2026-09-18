import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initializeDatabase } from "./config/db";
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import categoryRoutes from "./routes/categoryRoutes";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Retrieve the PORT from environment variables (default to 3000)
const PORT = process.env.PORT || "3000";

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
    // Finish connecting (and syncing, when explicitly enabled) before the
    // server accepts its first request.
    await initializeDatabase();

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`🌐 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // Exit instead of lingering: a process that stays alive without a database
    // never serves a working request, and looks healthy to a supervisor or
    // container orchestrator that only checks whether it is running.
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
