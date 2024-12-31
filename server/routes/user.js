import express from "express";
import { registerEmployee } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authMiddleware, registerEmployee);

export default router;
