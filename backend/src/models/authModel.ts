import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Unique,
  AllowNull,
} from "sequelize-typescript";

// Define the "users" table with Sequelize decorators
@Table({
  tableName: "users", // Specifies the table name in the database
  timestamps: false, // Disables automatic creation of timestamp fields (createdAt, updatedAt)
})
export default class User extends Model {
  // Primary key column with auto-increment
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED) // Unsigned integer type
  id!: number; // User ID (auto-generated)

  // Name column (non-nullable, string with max length 100)
  @AllowNull(false)
  @Column(DataType.STRING(100))
  name!: string; // User's name

  // Email column (non-nullable, unique, string with max length 255)
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(255))
  email!: string; // User's email address

  // Password column (non-nullable, string with max length 255)
  @AllowNull(false)
  @Column(DataType.STRING(255))
  password!: string; // User's hashed password
}
