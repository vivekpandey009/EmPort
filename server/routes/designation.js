import express from "express";
import {
  showDesignations,
  addDesignation,
  getDesignation,
  updateDesignation,
  deleteDesignation,
} from "../controllers/designationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.get("/", authMiddleware, showDesignations);
router.post("/add", authMiddleware, addDesignation);
router.get("/:id", authMiddleware, getDesignation);
router.put("/:id", authMiddleware, updateDesignation);
router.delete("/:id", authMiddleware, deleteDesignation);

export default router;
