import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditDesignation = () => {
  const { id } = useParams();
  const [designation, setDesignation] = useState({
    designationName: "",
    description: "",
    departmentId: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch departments
        const deptResponse = await axios.get(
          "http://localhost:3000/api/department",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Fetch current designation
        const desigResponse = await axios.get(
          `http://localhost:3000/api/designation/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (deptResponse.data.success && desigResponse.data.success) {
          setDepartments(deptResponse.data.departments);
          setDesignation({
            designationName: desigResponse.data.designation.designationName,
            description: desigResponse.data.designation.description,
            departmentId: desigResponse.data.designation.departmentId._id,
          });
        }
      } catch (error) {
        alert(error.response?.data?.error || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDesignation({ ...designation, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/designation/${id}`,
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
      alert(error.response?.data?.error || "Error updating designation");
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center p-5">
          <div className="text-xl">Loading...</div>
        </div>
      ) : (
        <div className="max-w-3xl p-8 mx-auto mt-10 bg-white rounded-md shadow-md w-96">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-center">
              Edit Designation
            </h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  name="departmentId"
                  value={designation.departmentId}
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
                  value={designation.designationName}
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
                  value={designation.description}
                  onChange={handleChange}
                  placeholder="Enter Description"
                  className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 mt-6 font-bold text-white rounded-md bg-sky-500 hover:bg-sky-300 hover:border hover:border-sky-700 hover:text-sky-900"
              >
                Update Designation
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditDesignation;
