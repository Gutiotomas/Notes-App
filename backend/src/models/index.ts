import User from "./authModel";
import Category from "./categoryModel";
import Note from "./noteModel";
import NoteCategory from "./noteCategoryModel";

// Export models individually and as an array for easy registration
export { User, Category, Note, NoteCategory };
export default [User, Category, Note, NoteCategory];
