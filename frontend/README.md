# Frontend - Notes Application

This is the frontend for the Notes Application — a React + TypeScript SPA built with Vite. It communicates with the backend REST API to manage users, notes, and categories.

Quick overview
- Create, edit, delete and archive notes
- Add/remove categories and filter notes by category

Tech stack
- React + TypeScript
- Vite (dev server)
- React Router
- Tailwind CSS (styles)

Getting started (development)
1. Clone the repository and enter the frontend folder:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables (create `.env` in the `frontend` folder):

```env
VITE_API_URL=http://localhost:3000
```

4. Start the dev server (Vite, default port 5173):

```bash
npm run dev
```

Building and preview
- Build for production:

```bash
npm run build
```

- Preview the production build locally:

```bash
npm run preview
```

Notes & troubleshooting
- If the UI behaves unexpectedly after login/logout, clear storage in the browser console:

```js
localStorage.clear(); sessionStorage.clear(); location.reload();
```
- Ensure `VITE_API_URL` points to a running backend API (default http://localhost:3000).
- Dev server logs appear in the terminal where you ran `npm run dev`.

If you want, I can also add example `.env.example` files or npm scripts to orchestrate frontend+backend in one command.
