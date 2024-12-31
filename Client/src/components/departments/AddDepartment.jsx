import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    departmentName: "",
    description: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDepartment({ ...department, [name]: value }); // Update the correct field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/department/add", // Use port 5000 if that's where your API is running
        department,
        {
          headers: {
            "Content-Type": "application/json", // Ensures JSON is sent
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className="max-w-3xl p-8 mx-auto mt-10 bg-white rounded-md shadow-md w-96">
      <div>
        <h2 className="mb-6 text-2xl font-bold text-center">Add Department</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="departmentName"
              className="text-sm font-medium text-gray-700"
            >
              Department Name
            </label>
            <input
              type="text"
              name="departmentName" // Add the correct name attribute
              onChange={handleChange}
              placeholder="Enter Department Name"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mt-3">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              onChange={handleChange}
              placeholder="Enter Description"
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <button className="w-full px-4 py-2 mt-6 font-bold text-white rounded-md bg-sky-500 hover:bg-sky-300 hover:border hover:border-sky-700 hover:text-sky-900">
            Add Department
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
