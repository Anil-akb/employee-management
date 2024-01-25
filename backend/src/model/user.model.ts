import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  role: "employee" | "manager";
  password: string;
  email: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "manager"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
