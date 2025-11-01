import mongoose from "mongoose";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

