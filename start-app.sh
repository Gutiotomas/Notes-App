#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define environment variables
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
# Backend environment variables
DB_NAME="notes_app"
DB_USER="root"
DB_PASSWORD="root"
DB_HOST="localhost"
DB_PORT="3306"
PORT=3000
JWT_SECRET=3f9c8b7e-4d2a-4e6f-9a1e-2c5d7f8a9b0c
SEED_USER_NAME=admin
SEED_USER_EMAIL=admin@example.com
SEED_USER_PASSWORD=admin1234
# Frontend environment variable
VITE_API_URL="http://localhost:3000"

# Step 1: Check for required dependencies
echo "Checking for required dependencies..."
if ! command -v node &> /dev/null; then
  echo "Node.js is not installed. Please install it and try again."
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo "npm is not installed. Please install it and try again."
  exit 1
fi

if ! command -v mysql &> /dev/null; then
  echo "MySQL client is not installed. Please install it and try again."
  exit 1
fi

# Step 2: Set up the backend
echo "Setting up the backend..."
cd $BACKEND_DIR

# Install backend dependencies
npm install

# Create the database if it doesn't exist
echo "Creating the database if it doesn't exist..."
mysql -u"$DB_USER" -p"$DB_PASSWORD" -h"$DB_HOST" -P"$DB_PORT" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

# Run database migrations
echo "Running database migrations..."
npx sequelize-cli db:migrate --config sequelize-config.js

# Seed the database (optional)
echo "Seeding the database..."
npx sequelize-cli db:seed:all --config sequelize-config.js

npm run dev &
BACKEND_PID=$!
cd ..

# Step 3: Set up the frontend
echo "Setting up the frontend..."
cd $FRONTEND_DIR

# Install frontend dependencies
npm install

npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for the user to terminate the script
echo "App is running. Press Ctrl+C to stop."
trap "kill $BACKEND_PID $FRONTEND_PID" SIGINT
wait