# Backend - Notes Application

This is the backend service for the Notes Application. It provides a REST API for managing users, notes, and categories. The backend is built with Node.js, Express, and Sequelize ORM, and it uses MySQL as the relational database.

---

## Features Implemented

### Phase 1: Note Creation

- **Create Notes**: Users can create notes with a title and description.
- **Edit Notes**: Users can update the content of existing notes.
- **Delete Notes**: Users can delete notes.
- **Archive/Unarchive Notes**: Users can toggle the archive status of notes.
- **List Active Notes**: Users can view all active notes.
- **List Archived Notes**: Users can view all archived notes.

### Phase 2: Tag Application and Filtering

- **Add/Remove Categories**: Users can assign categories (tags) to notes or remove them.
- **Filter Notes by Category**: Users can filter notes based on assigned categories.

### User-Specific Categories

- Categories are user-specific, meaning each user can only see and manage their own categories.

---

## Technologies Used

- **Node.js**: v18.17.0 - JavaScript runtime for building the backend.
- **Express**: v5.1.0 - Web framework for building REST APIs.
- **Sequelize**: v6.37.7 - ORM for interacting with the MySQL database.
- **MySQL**: v8.0.33 - Relational database for persisting data.
- **jsonwebtoken**: v9.0.2 - Library for generating and verifying JWT tokens.
- **bcrypt**: v5.1.1 - Library for hashing passwords.

---

## Installation and Setup

Follow these steps to set up and run the backend:

### 1. Clone the Repository

git clone <repository-url>
cd backend

### 2. Install Dependencies

npm install

### 3. Configure Environment Variables

Create a .env file in the backend directory and add the following environment variables:

PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=notes_app
JWT_SECRET=your_jwt_secret

### 4. Run the Application

npm run build
npm start
