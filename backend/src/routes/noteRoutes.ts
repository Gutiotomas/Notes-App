import { Router } from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  getArchivedNotes,
  updateNote,
  deleteNote,
  toggleArchiveNote,
  addCategoryToNote,
  removeCategoryFromNote,
  getNotesByCategory,
} from "../controllers/noteController";
import { validateNote } from "../middlewares/noteMiddleware";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authenticateToken, validateNote, createNote);
router.get("/", authenticateToken, getNotes);
router.get("/archive", authenticateToken, getArchivedNotes);
router.get("/:id", authenticateToken, getNoteById);
router.put("/:id", authenticateToken, validateNote, updateNote);
router.delete("/:id", authenticateToken, deleteNote);
router.patch("/:id/archive", authenticateToken, toggleArchiveNote);
router.post("/categories/add", authenticateToken, addCategoryToNote);
router.post("/categories/remove", authenticateToken, removeCategoryFromNote);
router.get("/categories/:categoryId", authenticateToken, getNotesByCategory);

export default router;
