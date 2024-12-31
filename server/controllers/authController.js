import User from "../models/User.js";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("\n🔐 Login attempt received:");
    console.log("Email:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    console.log("✅ User found:", {
      email: user.email,
      role: user.role,
      status: user.status,
    });

    // Use the model's comparePassword method
    const isMatch = await user.comparePassword(password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password verification failed");
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    if (user.status === "inactive") {
      console.log("❌ Account is inactive");
      return res.status(403).json({
        success: false,
        error: "Account is inactive",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    console.log("✅ Login successful!");

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstname: user.firstname,
        middlename: user.middlename,
        lastname: user.lastname,
        empCode: user.empCode,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during login",
    });
  }
};

const verify = async (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

export { login, verify };
