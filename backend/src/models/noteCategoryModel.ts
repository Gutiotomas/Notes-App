import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from "sequelize-typescript";
import Note from "./noteModel";
import Category from "./categoryModel";

/**
 * Represents the association between notes and categories.
 * This model defines a many-to-many relationship between the `Note` and `Category` models.
 */
@Table({
  tableName: "note_categories", // Specifies the name of the table in the database
  timestamps: false, // Disables automatic timestamp fields (createdAt, updatedAt)
})
export default class NoteCategory extends Model {
  /**
   * Foreign key referencing the `Note` model.
   */
  @ForeignKey(() => Note)
  @Column(DataType.INTEGER)
  noteId!: number;

  /**
   * Foreign key referencing the `Category` model.
   */
  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  categoryId!: number;
}
