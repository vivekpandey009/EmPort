import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
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
  const [designations, setDesignations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/designation",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status === 200 && response.data?.designations) {
        setDesignations(response.data.designations);
      }
    } catch (error) {
      console.error("Error fetching designations:", error);
      alert("Failed to load designations. Please try refreshing the page.");
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
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    //   try {
    //     const response = await axios.post(
    //       "http://localhost:3000/api/employees/add",
    //       data,
    //       {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //           Authorization: `Bearer ${localStorage.getItem("token")}`,
    //         },
    //       }
    //     );
    //     if (response.data.success) {
    //       navigate("/admin-dashboard/employees");
    //     }
    //   } catch (error) {
    //     // More specific error handling
    //     const errorMessage =
    //       error.response?.data?.error || "Error adding employee";
    //     alert(errorMessage);
    //     console.error("Detailed error:", error.response?.data);
    //   }
    // };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/employees/add",
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
      // More specific error handling
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details ||
        "Error adding employee";

      alert(errorMessage);
      console.error("Detailed error:", error.response?.data);
    }
  };

  return (
    <div className="max-w-3xl p-8 mx-auto mt-10 bg-white rounded-md shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* First Name Field */}
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="p-2 border rounded"
            required
          />

          {/* Middle Name Field */}
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            placeholder="Middle Name"
            className="p-2 border rounded"
          />

          {/* Last Name Field */}
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="p-2 border rounded"
            required
          />

          {/* Date of Birth Field */}
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
            <small className="text-gray-500">Enter your birth date.</small>
          </div>

          {/* Gender Field */}
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

          {/* Marital Status Field */}
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
          </select>

          {/* Designation Field */}
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

          {/* Date of Joining Field */}
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
            <small className="text-gray-500">Enter your joining date.</small>
          </div>

          {/* Salary Field */}
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary"
            className="p-2 border rounded"
            required
          />

          {/* Email Field */}
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
          <label className="block mb-2">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="p-2 text-sm text-gray-600 bg-gray-100 rounded">
          Company email will be automatically generated as:
          firstname.lastname@emport.com
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
