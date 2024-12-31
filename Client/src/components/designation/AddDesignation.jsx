import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDesignation = () => {
  const [designation, setDesignation] = useState({
    designationName: "",
    description: "",
    departmentId: "",
  });
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/department",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setDepartments(response.data.departments);
        }
      } catch (error) {
        alert(error.response?.data?.error || "Error fetching departments");
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDesignation({ ...designation, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/designation/add",
        designation,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/designations");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error adding designation");
    }
  };

  return (
    <div className="max-w-3xl p-8 mx-auto mt-10 bg-white rounded-md shadow-md w-96">
      <div>
        <h2 className="mb-6 text-2xl font-bold text-center">Add Designation</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="departmentId"
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <label className="text-sm font-medium text-gray-700">
              Designation Name
            </label>
            <input
              type="text"
              name="designationName"
              onChange={handleChange}
              placeholder="Enter Designation Name"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">
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
            Add Designation
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDesignation;
