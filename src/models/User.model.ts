import mongoose, { Schema, models, Document } from "mongoose";

export interface UserType extends Document {
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "editor"], default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

const User =
  (models.User as mongoose.Model<UserType>) ||
  mongoose.model<UserType>("User", UserSchema);

export default User;
