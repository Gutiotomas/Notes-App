import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/WelcomePage.tsx"),
  route("/home", "routes/Landing.tsx"),
  route("/login", "routes/Authentication.tsx"),
  route("/register", "routes/Registration.tsx"),
  route("/notes", "routes/Notes.tsx"),
  route("/categories", "routes/Categories.tsx"),
  route("/archive", "routes/ArchiveNotes.tsx"),
  route("/edit/:id", "routes/EditNotes.tsx"),
] satisfies RouteConfig;
