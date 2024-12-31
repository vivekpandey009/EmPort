import Designation from "../models/Designation.js";

const showDesignations = async (req, res) => {
  try {
    const designations = await Designation.find().populate(
      "departmentId",
      "departmentName"
    );
    return res.status(200).json({ success: true, designations });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error in get designations" });
  }
};

const addDesignation = async (req, res) => {
  try {
    const { designationName, description, departmentId } = req.body;
    const newDesignation = new Designation({
      designationName,
      description,
      departmentId,
    });
    await newDesignation.save();
    res.status(200).json({ success: true, designation: newDesignation });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error in add designation" });
  }
};

const getDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const designation = await Designation.findById(id).populate(
      "departmentId",
      "departmentName"
    );
    return res.status(200).json({ success: true, designation });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error in get designation" });
  }
};

const updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { designationName, description, departmentId } = req.body;
    const updatedDesignation = await Designation.findByIdAndUpdate(
      { _id: id },
      { designationName, description, departmentId },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, designation: updatedDesignation });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error in updating designation" });
  }
};

const deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDesignation = await Designation.findByIdAndDelete({ _id: id });
    return res
      .status(200)
      .json({ success: true, designation: deletedDesignation });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error in deleting designation" });
  }
};

export {
  showDesignations,
  addDesignation,
  getDesignation,
  updateDesignation,
  deleteDesignation,
};
