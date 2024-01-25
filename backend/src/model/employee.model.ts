import mongoose, { Document, Schema } from "mongoose";
import User, { IUser } from "./user.model";

export interface IEmployee extends Document {
  location: string;
  department: Schema.Types.ObjectId;
  email: string;
  password: string;
  name: string;
}

const employeeSchema = new Schema<IEmployee>(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },
  },
  { timestamps: true }
);

employeeSchema.pre<IEmployee>("save", async function (next) {
  try {
    const user: IUser = new User({
      email: this.email,
      password: this.password,
      name: this.name,
      role: "employee",
    });

    await user.save();
    next();
  } catch (error: any) {
    console.error("User save error:", error);
    next(error);
  }
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
