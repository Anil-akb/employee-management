import { Router } from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from "../controller/departmentController";

const router = Router();

router.route("/department").post(createDepartment).get(getDepartments);

router
  .route("/department/:id")
  .get(getDepartmentById)
  .put(updateDepartment)
  .delete(deleteDepartment);

export default router;
