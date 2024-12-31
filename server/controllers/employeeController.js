import Employee from "../models/Employee.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

const addEmployee = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Profile image is required",
      });
    }

    const employeeData = {
      ...req.body,
      profileImage: req.file.path.replace(/\\/g, "/"),
    };

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "designationId",
      "dateOfJoining",
      "salary",
      "personalEmail",
    ];

    for (const field of requiredFields) {
      if (!employeeData[field]) {
        return res.status(400).json({
          success: false,
          error: `${field} is required`,
        });
      }
    }

    const employee = new Employee(employeeData);

    try {
      await employee.save();
    } catch (saveError) {
      // More comprehensive error handling
      if (saveError.code === 11000) {
        // Duplicate key error
        const errorMessage = saveError.message.includes("personalEmail")
          ? "An employee with this personal email already exists"
          : "Duplicate entry error";

        return res.status(400).json({
          success: false,
          error: errorMessage,
          details: saveError.message,
        });
      }

      // Other validation errors
      if (saveError.name === "ValidationError") {
        const errors = Object.values(saveError.errors).map(
          (err) => err.message
        );
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          details: errors,
        });
      }

      // Unexpected errors
      console.error("Unexpected save error:", saveError);
      return res.status(500).json({
        success: false,
        error: "Unexpected error occurred",
        details: saveError.message,
      });
    }

    res.status(201).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({
      success: false,
      error: "Error creating employee",
      details: error.message,
    });
  }
};

const storage = multer.diskStorage({
  destination: "./uploads/profile-images/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Invalid image format. Only JPEG, JPG and PNG allowed."));
  },
});

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate({
      path: "designationId",
      populate: { path: "departmentId" },
    });
    res.json({ success: true, employees });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate({
      path: "designationId",
      populate: { path: "departmentId" },
    });

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    res.json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    res.json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  console.log("Attempting to delete employee with ID:", req.params.id);
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete({ _id: id });
    return res.status(200).json({ success: true, employee });

    // // Delete profile image file if it exists
    // if (employee.profileImage) {
    //   try {
    //     await fs.unlink(employee.profileImage);
    //   } catch (fileError) {
    //     console.error("Error deleting profile image:", fileError);
    //     // Continue with employee deletion even if image deletion fails
    //   }
    // }

    // // Delete the employee record
    // await Employee.findByIdAndDelete(req.params.id);

    // res.json({
    //   success: true,
    //   message: "Employee deleted successfully",
    // });
  } catch (error) {
    console.error("Detailed deletion error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error deleting employee",
    });
  }
};

export { addEmployee };
