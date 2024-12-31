import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [designations, setDesignations] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    designationId: "",
    dateOfJoining: "",
    salary: "",
    personalEmail: "",
    profileImage: null,
  });
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    fetchEmployee();
    fetchDesignations();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/employees/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        const employee = response.data.employee;
        setFormData({
          firstName: employee.firstName,
          middleName: employee.middleName || "",
          lastName: employee.lastName,
          dateOfBirth: new Date(employee.dateOfBirth)
            .toISOString()
            .split("T")[0],
          gender: employee.gender,
          maritalStatus: employee.maritalStatus,
          designationId: employee.designationId._id,
          dateOfJoining: new Date(employee.dateOfJoining)
            .toISOString()
            .split("T")[0],
          salary: employee.salary,
          personalEmail: employee.personalEmail,
        });
        setCurrentImage(employee.profileImage);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error fetching employee details");
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/designation",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data?.designations) {
        setDesignations(response.data.designations);
      }
    } catch (error) {
      console.error("Error fetching designations:", error);
      alert("Failed to load designations");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Only append fields that have changed
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.put(
        `http://localhost:3000/api/employees/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error updating employee");
    }
  };

  return (
    <div className="max-w-3xl p-8 mx-auto mt-10 bg-white rounded-md shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center">Edit Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="p-2 border rounded"
            required
          />

          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            placeholder="Middle Name"
            className="p-2 border rounded"
          />

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="p-2 border rounded"
            required
          />

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
          </div>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>

          <select
            name="designationId"
            value={formData.designationId}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Designation</option>
            {designations.map((designation) => (
              <option key={designation._id} value={designation._id}>
                {designation.designationName}
              </option>
            ))}
          </select>

          <div>
            <label
              htmlFor="dateOfJoining"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Joining
            </label>
            <input
              type="date"
              id="dateOfJoining"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
          </div>

          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary"
            className="p-2 border rounded"
            required
          />

          <input
            type="email"
            name="personalEmail"
            value={formData.personalEmail}
            onChange={handleChange}
            placeholder="Personal Email"
            className="p-2 border rounded"
            required
          />
        </div>

        <div>
          {currentImage && (
            <div className="mb-2">
              <p className="mb-1">Current Profile Image:</p>
              <img
                src={`http://localhost:3000/${currentImage}`}
                alt="Current profile"
                className="object-cover w-32 h-32 rounded"
              />
            </div>
          )}
          <label className="block mb-2">Update Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Update Employee
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard/employees")}
            className="w-full px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;
