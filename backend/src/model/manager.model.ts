import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model";

export interface Manager extends IUser {
  department: Schema.Types.ObjectId;
}

const managerSchema = new Schema<Manager>({
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
});

const Manager = mongoose.model("Manager", managerSchema);

export default Manager;
