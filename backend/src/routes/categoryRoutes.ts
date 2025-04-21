import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoriesByNote,
  getCategoriesNotInNote,
} from "../controllers/categoryController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateCategory } from "../middlewares/categoryMiddleware";

const router = Router();

router.post("/", authenticateToken, validateCategory, createCategory);
router.get("/", authenticateToken, getCategories);
router.get("/note/:noteId", authenticateToken, getCategoriesByNote);
router.get("/note/:noteId/not-in", authenticateToken, getCategoriesNotInNote);
router.get("/:id", authenticateToken, getCategoryById);
router.put("/:id", authenticateToken, validateCategory, updateCategory);
router.delete("/:id", authenticateToken, deleteCategory);

export default router;
