import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  getEmployeesByLocation,
  getEmployeesByName,
  updateEmployee,
} from "../controller/employeeController";

const router = Router();

router.route("/employee").post(createEmployee).get(getEmployees);

router
  .route("/employee/:id")
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

router.route("/location/employee").get(getEmployeesByLocation);
router.route("/name/employee").get(getEmployeesByName);

export default router;
