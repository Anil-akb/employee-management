import { Request, Response } from "express";
import Department from "../model/department.model";
import { authCheck } from "../middleware/authMiddleware";

// Create a new department

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { deptName } = req.body;
    const managerId = (req as any).user?.id;

    authCheck(req, res, async () => {
      const authenticatedUser = (req as any).user;
      if (!authenticatedUser || authenticatedUser.role !== "manager") {
        return res.status(403).json({
          message: "Permission denied. Only managers can create departments.",
        });
      }

      const newDepartment = new Department({ deptName, manager: managerId });
      const savedDepartment = await newDepartment.save();

      res.status(201).json({
        savedDepartment,
        message: "Department crearered successfully",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all departments

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get department by ID

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const departmentId = req.params.id;
    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update department

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const departmentId = req.params.id;
    const { deptName } = req.body;

    // Check if the authenticated user is a manager or not
    authCheck(req, res, async () => {
      if (!(req as any).user?.id || (req as any).user?.role !== "manager") {
        console.log("--", (req as any).user?.id || (req as any).user?.role);
        return res.status(403).json({
          message: "Permission denied. Only managers can update departments.",
        });
      }

      const updatedDepartment = await Department.findByIdAndUpdate(
        departmentId,
        { deptName },
        { new: true }
      );

      if (!updatedDepartment) {
        return res.status(404).json({ message: "Department not found" });
      }

      res.status(200).json({
        updatedDepartment,
        message: "Department updated successfully",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Delete a department

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const departmentId = req.params.id;

    // Check if the authenticated user is a manager or not
    authCheck(req, res, async () => {
      if (!(req as any).user?.id || (req as any).user?.role !== "manager") {
        return res.status(403).json({
          message: "Permission denied. Only managers can delete departments.",
        });
      }

      const deletedDepartment = await Department.findByIdAndDelete(
        departmentId
      );

      if (!deletedDepartment) {
        return res.status(404).json({ message: "Department not found" });
      }

      res.status(200).json({
        deletedDepartment,
        message: "Department deleted successfully",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
