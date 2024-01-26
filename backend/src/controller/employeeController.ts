import { Request, Response } from "express";
import Employee from "../model/employee.model";
import { SortOrder } from "mongoose";
import bcrypt from "bcryptjs";
import { ParsedQs } from "qs";

import Department from "../model/department.model";
import { authCheck } from "../middleware/authMiddleware";

type SortOptionObject = { [key: string]: "asc" | "desc" };

// Create a new employee
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { email, name, password, location, departmentId } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "please fill all required fields" });
    }
    const existingDepartment = await Department.findById(departmentId);
    const hashedPassword = await bcrypt.hash(password, 10);

    // if (!existingDepartment) {
    //   return res.status(404).json({ message: "Department not found" });
    // }

    const newEmployee = new Employee({
      email,
      name,
      password: hashedPassword,
      location,
      department: departmentId,
    });

    const savedEmployee = await newEmployee.save();

    res.status(201).json({
      savedEmployee,
      message: "Employee created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all employees
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get an employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update an employee by ID
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.id;
    const { email, name, password, location, departmentId } = req.body;

    // Check if the authenticated user is a manager
    authCheck(req, res, async () => {
      if (!(req as any).user?.id || (req as any).user?.role !== "manager") {
        return res.status(403).json({
          message: "Permission denied. Only managers can update employees.",
        });
      }

      const updatedEmployee = await Employee.findByIdAndUpdate(
        employeeId,
        { email, name, password, location, department: departmentId },
        { new: true }
      );

      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json({
        updatedEmployee,
        message: "Employee updated successfully",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete an employee by ID
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.id;

    authCheck(req, res, async () => {
      if (!(req as any).user?.id || (req as any).user?.role !== "manager") {
        return res.status(403).json({
          message: "Permission denied. Only managers can delete employees.",
        });
      }

      const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

      if (!deletedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json({
        deletedEmployee,
        message: "Employee deleted successfully",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//

export const getEmployeesByLocation = async (req: Request, res: Response) => {
  try {
    // const employees = await Employee.find();
    const employees = await Employee.find({}).sort({ location: 1 });

    res.status(200).json({ employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getEmployeesByName = async (req: Request, res: Response) => {
  try {
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    // Validate sortOrder
    if (![1, -1].includes(sortOrder)) {
      return res.status(400).json({ message: "Invalid sortOrder value" });
    }

    const sortOptions: [string, SortOrder][] = [["name", sortOrder]];

    const employees = await Employee.find().sort(sortOptions);
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
