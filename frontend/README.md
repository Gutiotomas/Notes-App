# Frontend - Notes Application

This is the frontend for the Notes Application. It is a Single Page Application (SPA) built with React and TypeScript. The frontend interacts with the backend REST API to manage users, notes, and categories.

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

---

## Technologies Used

- **React**: v18.2.0 - JavaScript library for building user interfaces.
- **TypeScript**: v5.1.6 - Superset of JavaScript for type safety.
- **Vite**: v4.3.9 - Build tool for fast development.
- **React Router**: v6.14.1 - Library for routing in React applications.
- **Tailwind CSS**: v3.3.2 - Utility-first CSS framework for styling.

---

## Installation and Setup

Follow these steps to set up and run the frontend:

### 1. Clone the Repository

git clone <repository-url>
cd frontend

### 2. Install Dependencies

npm install

### 3. Configure Environment Variables

Create a .env file in the frontend directory and add the following environment variables:

VITE_API_URL=http://localhost:3000

### 4 Run the Application

npm run build
npm start
