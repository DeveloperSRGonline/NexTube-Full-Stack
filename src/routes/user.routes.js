import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

// final url will be /users/register
router.route("/register").post(registerUser)

// router.route("/login").post()

export default router;