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

- **Node.js**: Requires a version >= 18.17.0 - JavaScript runtime for building the backend.
- **Express**: ^5.1.0 - Web framework for building REST APIs.
- **Sequelize**: ^6.37.7 - ORM for interacting with the MySQL database.
- **sequelize-typescript**: ^2.1.6 - TypeScript decorators support for Sequelize.
- **mysql2**: ^3.14.0 - MySQL client for Node.js (used by Sequelize).
- **jsonwebtoken**: ^9.0.2 - Library for generating and verifying JWT tokens.
- **bcrypt**: ^6.0.0 - Library for hashing passwords.
- **reflect-metadata**: ^0.1.13 - Required for TypeScript decorators.
- **dotenv**: ^16.5.0 - Loads environment variables from a .env file.
- **cors**: ^2.8.5 - Middleware to enable CORS.
- **snyk**: ^1.1302.1 - Security tooling (included as dependency).
- **Dev tools**: `ts-node-dev` (^2.0.0), `typescript` (^5.3.3), and related `@types/*` packages.

### Frontend

- **React**: ^19.0.0 - JavaScript library for building user interfaces.
- **React DOM**: ^19.0.0
- **React Router**: ^7.13.0 - Routing and server/serve helpers.
- **TypeScript**: ^5.7.2 - Superset of JavaScript for type safety.
- **Vite**: ^6.4.1 - Build tool for fast development.
- **Tailwind CSS**: ^4.0.0 - Utility-first CSS framework for styling.
- **react-icons**: ^5.5.0 - Icon library for React.
- **jwt-decode**: ^4.0.0 - Decode JWT tokens on the client.
- **isbot**: ^5.1.17 - Bot detection utility used by server rendering.
- **Dev tools**: `@react-router/dev`, `@tailwindcss/vite`, `vite-tsconfig-paths`, and other dev dependencies.

---

## App Deployment

Visit [Notes App](https://notes-app-frontend-kappa-three.vercel.app/) to access the App.
It may take up to 1 minute for full functionality after entering a request such as login or registration.

The backend is deployed in Render.
The frontend is deployed in Vercel.
The Database is deployed in Clever Cloud.

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
