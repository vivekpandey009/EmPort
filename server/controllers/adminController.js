// controllers/adminController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";

const createAdmin = async (req, res) => {
  try {
    // Only existing admins can create new admins
    if (!req.user.isAdmin()) {
      return res.status(403).json({
        success: false,
        error: "Only administrators can create new admins",
      });
    }

    const {
      firstname,
      middlename,
      lastname,
      email,
      empCode,
      password,
      permissions,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    // Create new admin
    const hashPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      firstname,
      middlename,
      lastname,
      email,
      empCode,
      password: hashPassword,
      role: "admin",
      permissions: permissions || [
        "create_user",
        "edit_user",
        "delete_user",
        "view_all_employees",
        "manage_roles",
      ],
      createdBy: req.user._id,
    });

    await newAdmin.save();

    // Remove password from response
    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: adminResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const listAdmins = async (req, res) => {
  try {
    if (!req.user.isAdmin()) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const admins = await User.find({ role: "admin" })
      .select("-password")
      .populate("createdBy", "firstname lastname email");

    res.status(200).json({
      success: true,
      admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export { createAdmin, listAdmins };
