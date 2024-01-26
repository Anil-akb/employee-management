import { Router } from "express";
import { getAllUsers, getUserById } from "../controller/userController";

const router = Router();

router.route("/user").get(getAllUsers);
router.route("/user/:id").get(getUserById);

export default router;
