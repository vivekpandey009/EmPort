import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Check if birthday hasn't occurred this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/employees/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Employee fetch response:", response.data);
        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        console.error("Full error details:", error);
        alert(error.response?.data?.error || "Error fetching employee details");
        navigate("/admin-dashboard/employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );

  if (!employee) return null;

  return (
    <div className="max-w-4xl p-8 mx-auto mt-10 bg-white rounded-md shadow-md">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-6">
          <img
            src={`http://localhost:3000/${employee.profileImage}`}
            alt={employee.firstName}
            className="object-cover w-56 h-56 rounded-full"
          />
          <div className="font-Grotesk  ">
            <h2 className="text-2xl font-bold">
              {`${employee.firstName} ${employee.middleName} ${employee.lastName}`}
            </h2>
            <p className="text-gray-600">
              Employee Code: {employee.employeeCode}
            </p>
            <p className="text-gray-600">Username: {employee.username}</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin-dashboard/employees")}
          className="px-4 py-2 text-white bg-sky-500 rounded hover:bg-sky-300 hover:border-solid hover:border-sky-700 hover:text-sky-700 hover:font-bold"
        >
          Back to main List
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 border rounded-md">
          <h3 className="mb-3 text-lg font-semibold">Personal Information</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Date of Birth:</span>{" "}
              {new Date(employee.dateOfBirth).toLocaleDateString()}
              <span className="ml-2 text-gray-600">
                (Age: {calculateAge(employee.dateOfBirth)} years)
              </span>
            </p>
            <p>
              <span className="font-medium">Gender:</span> {employee.gender}
            </p>
            <p>
              <span className="font-medium">Marital Status:</span>{" "}
              {employee.maritalStatus}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {employee.personalEmail}
            </p>
          </div>
        </div>

        <div className="p-4 border rounded-md">
          <h3 className="mb-3 text-lg font-semibold">Professional Details</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Department:</span>{" "}
              {employee.designationId.departmentId.departmentName}
            </p>
            <p>
              <span className="font-medium">Designation:</span>{" "}
              {employee.designationId.designationName}
            </p>
            <p>
              <span className="font-medium">Date of Joining:</span>{" "}
              {new Date(employee.dateOfJoining).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Salary:</span> <span>&#8377; </span>
              {employee.salary.toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {employee.companyEmail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
