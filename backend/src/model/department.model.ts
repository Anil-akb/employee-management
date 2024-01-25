// src/models/Department.ts
import mongoose, { Document, Schema, model } from "mongoose";

export interface IDepartment extends Document {
  deptName: string;
  manager: Schema.Types.ObjectId;
}

const departmentSchema = new Schema<IDepartment>(
  {
    deptName: { type: String, required: true },
    manager: { type: Schema.Types.ObjectId, ref: "Manager" },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
