# Backend - Notes Application

This service provides the REST API for users, notes and categories. It uses Express + Sequelize and expects a MySQL database.

Main capabilities
- User registration / authentication (JWT)
- CRUD for notes and categories
- Archive/unarchive notes
- User-scoped categories

Getting started
1. Clone the repo and enter the backend folder:

```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables — create a `.env` file in `backend` with values similar to:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=secret
DB_NAME=notes_app
JWT_SECRET=replace-with-a-secure-secret
```

Database setup & migrations
- Ensure your MySQL server is running and the configured DB user can create the database.
- Run migrations (if using sequelize-cli):

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Running the server
- Development (auto-restart):

```bash
npm run dev
```

- Production (build + start):

```bash
npm run build
npm start
```

Useful notes
- The server defaults to `http://localhost:3000` (use `PORT` to change).
- If you use the provided `start-app.sh` helper, run it from a POSIX shell (WSL, Git Bash) on Windows.
- If you see authentication failures from the frontend, verify `JWT_SECRET` matches and that the frontend `VITE_API_URL` points to this backend.

If you want, I can add a `.env.example` and npm scripts to run frontend+backend together (or a simple Docker Compose file).
