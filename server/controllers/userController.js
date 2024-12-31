import User from "../models/User.js";

export const registerEmployee = async (req, res) => {
  try {
    const { firstname, middlename, lastname, email, password, empCode } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { empCode }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with this email or employee code already exists",
      });
    }

    // Create new user
    const newUser = new User({
      firstname,
      middlename,
      lastname,
      email,
      empCode,
      password,
      role: "employee",
    });

    await newUser.save();

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
