import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  ForeignKey,
} from "sequelize-typescript";
import Note from "./noteModel";
import User from "./authModel";
import NoteCategory from "./noteCategoryModel";

// Define the "categories" table with Sequelize decorators
@Table({
  tableName: "categories", // Specify the table name in the database
  timestamps: false, // Disable automatic timestamps (createdAt, updatedAt)
})
export default class Category extends Model {
  // Primary key column with auto-increment
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number; // Unique identifier for the category

  // Name column with a maximum length of 100 characters, cannot be null
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string; // Name of the category

  // Foreign key column referencing the User model
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number; // ID of the user who owns the category

  // Many-to-many relationship with the Note model through the NoteCategory model
  @BelongsToMany(() => Note, () => NoteCategory)
  notes!: Note[]; // List of notes associated with the category
}
