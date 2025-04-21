# Notes Application

This is a full-stack Notes Application that allows users to create, edit, delete, and manage notes. Users can also categorize notes, archive them, and filter notes by categories. The application includes user authentication and authorization.

---

## Features

### Authentication
- **Login**: Users can log in with their email and password.
- **Registration**: Users can register with their name, email, and password.
- **Default Admin User**:
  - Email: `admin@example.com`
  - Password: `admin1234`

### Notes Management
- **Create Notes**: Users can create notes with a title, content, and categories.
- **Edit Notes**: Users can update the title, content, and categories of existing notes.
- **Delete Notes**: Users can delete notes.
- **Archive/Unarchive Notes**: Users can toggle the archive status of notes.
- **Filter Notes by Category**: Users can filter notes based on assigned categories.

### Categories Management
- **Add/Remove Categories**: Users can assign categories to notes or remove them.
- **Manage Categories**: Users can create, edit, and delete categories.

---

## Technologies Used

### Backend
- **Node.js**: v18.17.0 - JavaScript runtime for building the backend.
- **Express**: v5.1.0 - Web framework for building REST APIs.
- **Sequelize**: v6.37.7 - ORM for interacting with the MySQL database.
- **MySQL**: v8.0.33 - Relational database for persisting data.
- **jsonwebtoken**: v9.0.2 - Library for generating and verifying JWT tokens.
- **bcrypt**: v5.1.1 - Library for hashing passwords.

### Frontend
- **React**: v18.2.0 - JavaScript library for building user interfaces.
- **TypeScript**: v5.1.6 - Superset of JavaScript for type safety.
- **Vite**: v4.3.9 - Build tool for fast development.
- **React Router**: v6.14.1 - Library for routing in React applications.
- **Tailwind CSS**: v3.3.2 - Utility-first CSS framework for styling.

---

## App Deployment

Visit [Notes App](https://notes-app-frontend-kappa-three.vercel.app/) to access the App.
It may take up to 1 minute for full functionality after entering a request such as login or registration.

The backend is deployed in Render.
The frontend is deployed in Vercel.
The Database is deployed in FreeSQLdatabase.

---

## Or Alternatively Run the Application Locally

To run the application locally, use the provided `start-app.sh` script. This script will set up and start both the backend and frontend services.

### Steps:
1. Ensure you have all required dependencies installed (e.g., Node.js, MySQL).
2. Clone the repository and navigate to the project directory.
3. Run the following command in your terminal:
    ```bash
    ./start-app.sh
    ```
4. Open your browser and navigate to `http://localhost:5173` to access the application.

---

## API Endpoints

### Authentication
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Log in and receive a JWT token.

### Notes
- `POST /notes`: Create a new note.
- `GET /notes`: Get all active notes.
- `GET /notes/archive`: Get all archived notes.
- `GET /notes/:id`: Get a specific note by ID.
- `PUT /notes/:id`: Update a note by ID.
- `DELETE /notes/:id`: Delete a note by ID.
- `PATCH /notes/:id/archive`: Toggle the archive status of a note.

### Categories
- `POST /categories`: Create a new category (user-specific).
- `GET /categories`: Get all categories for the authenticated user.
- `GET /categories/note/:noteId`: Get categories associated with a specific note.
- `GET /categories/note/:noteId/not-in`: Get categories not associated with a specific note.
- `PUT /categories/:id`: Update a category by ID.
- `DELETE /categories/:id`: Delete a category by ID.

---

## Notes

- **Default Admin User**:
  - Email: `admin@example.com`
  - Password: `admin1234`
- You can also create additional users through the registration page.

---

## License

This project is licensed under the MIT License.
