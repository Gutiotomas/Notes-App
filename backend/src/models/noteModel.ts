import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  ForeignKey,
  BelongsToMany,
} from "sequelize-typescript";
import User from "./authModel";
import Category from "./categoryModel";
import NoteCategory from "./noteCategoryModel";

// Define the "notes" table with Sequelize decorators
@Table({
  tableName: "notes", // Name of the table in the database
  timestamps: false, // Disable automatic timestamp fields (createdAt, updatedAt)
})
export default class Note extends Model {
  // Primary key column with auto-increment
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  // Foreign key referencing the "users" table
  @ForeignKey(() => User)
  @Column({
    // Must match User.id (INTEGER.UNSIGNED): MySQL rejects a foreign key whose
    // sides differ in signedness, and sync({ alter: true }) would otherwise try
    // to rewrite this column back to signed on every boot.
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false, // Field cannot be null
  })
  userId!: number;

  // Title of the note
  @Column({
    type: DataType.STRING(255), // String with a maximum length of 255 characters
    allowNull: false, // Field cannot be null
  })
  title!: string;

  // Content of the note
  @Column({
    type: DataType.TEXT, // Text type for larger content
    allowNull: false, // Field cannot be null
  })
  content!: string;

  // Monetary value associated with the note
  @Default(0)
  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  value!: number;

  // Optional number of installments for the note value
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  installments?: number | null;

  // Archived status of the note, default is false
  @Default(false)
  @Column({
    type: DataType.BOOLEAN, // Boolean type for true/false values
  })
  archived!: boolean;

  // Many-to-many relationship with the "categories" table
  @BelongsToMany(() => Category, () => NoteCategory)
  categories!: Category[];
}
