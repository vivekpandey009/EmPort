import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
  upload,
} from "../controllers/employeeController.js";

const router = express.Router();
router.post("/add", authMiddleware, upload.single("profileImage"), addEmployee);
router.get("/", authMiddleware, getEmployees);
router.get("/:id", authMiddleware, getEmployee);
router.put(
  "/:id",
  authMiddleware,
  upload.single("profileImage"),
  updateEmployee
);
router.delete("/:id", authMiddleware, deleteEmployee);

export default router;
