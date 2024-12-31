import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      required: true,
    },
    designationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      required: true,
    },
    dateOfJoining: { type: Date, required: true },
    salary: { type: Number, required: true },
    personalEmail: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
      // Explicitly remove any existing unique index
      index: { unique: false },
    },
    companyEmail: {
      type: String,
      default: null,
      sparse: true, // This allows multiple null values
    },
    employeeCode: {
      type: String,
      default: null,
      sparse: true, // This allows multiple null values
    },
    username: {
      type: String,
      default: null,
      sparse: true, // This allows multiple null values
    },
    profileImage: {
      type: String,
      required: true,
    },
  },
  {
    // Add a collection-level index for unique constraint
    indexes: [
      {
        personalEmail: 1,
        companyEmail: 1,
        employeeCode: 1,
        unique: true,
        partialFilterExpression: {
          personalEmail: { $type: "string" },
          companyEmail: { $type: "string" },
          employeeCode: { $type: "string" },
        },
      },
    ],
  }
);

// Remove any pre-existing unique indexes (you may need to do this manually in MongoDB)
employeeSchema.index({ personalEmail: 1 }, { unique: false });
employeeSchema.index({ companyEmail: 1 }, { unique: false });
employeeSchema.index({ employeeCode: 1 }, { unique: false });

employeeSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const Employee = mongoose.model("Employee");

      // Check for existing personal email
      const existingEmailEmployee = await Employee.findOne({
        personalEmail: this.personalEmail,
      });
      if (
        existingEmailEmployee &&
        existingEmailEmployee._id.toString() !== this._id?.toString()
      ) {
        return next(new Error("Personal email already exists"));
      }

      // Generate username with more robust uniqueness
      const usernameBase = `${this.firstName}${this.middleName || ""}${
        this.lastName
      }`
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      let username = usernameBase;
      let counter = 1;
      while (await Employee.findOne({ username: username })) {
        username = `${usernameBase}${counter}`;
        counter++;
      }
      this.username = username;

      // Generate employee code with more robust uniqueness
      const initials = (
        this.firstName.charAt(0) +
        (this.middleName ? this.middleName.charAt(0) : "") +
        this.lastName.charAt(0)
      ).toUpperCase();

      let employeeCode = `E${initials}${this.lastName
        .substring(0, 3)
        .toUpperCase()}`;
      counter = 1;
      while (await Employee.findOne({ employeeCode: employeeCode })) {
        employeeCode = `E${initials}${this.lastName
          .substring(0, 3)
          .toUpperCase()}${counter}`;
        counter++;
      }
      this.employeeCode = employeeCode;

      // Generate company email with more robust uniqueness
      const emailBase = `${this.firstName.toLowerCase()}.${this.lastName.toLowerCase()}`;
      let email = `${emailBase}@emport.com`;
      counter = 1;
      while (await Employee.findOne({ companyEmail: email })) {
        email = `${emailBase}${counter}@emport.com`;
        counter++;
      }
      this.companyEmail = email;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Ensure the generated fields are set before save
employeeSchema.pre("save", function (next) {
  if (!this.username) this.username = null;
  if (!this.employeeCode) this.employeeCode = null;
  if (!this.companyEmail) this.companyEmail = null;
  next();
});

export default mongoose.model("Employee", employeeSchema);
