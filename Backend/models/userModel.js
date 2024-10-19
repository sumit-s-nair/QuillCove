import mongoose from "mongoose";
import { noteSchema } from "./noteModel.js";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    notes: [noteSchema],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
