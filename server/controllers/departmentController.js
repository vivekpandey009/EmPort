import Department from "../models/Department.js";

const showDepartment = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error in get departments" });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { departmentName, description } = req.body;
    const newDepartment = new Department({ departmentName, description });
    await newDepartment.save();
    res.status(200).json({ success: true, department: newDepartment });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error in add department" });
  }
};

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById({ _id: id });
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error in get department" });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentName, description } = req.body;
    const updateDepartment = await Department.findByIdAndUpdate(
      { _id: id },
      { departmentName, description }
    );
    return res.status(200).json({ success: true, updateDepartment });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error in updating department" });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDepartment = await Department.findByIdAndDelete({ _id: id });
    return res.status(200).json({ success: true, deleteDepartment });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error in deleting department" });
  }
};

export {
  showDepartment,
  addDepartment,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
