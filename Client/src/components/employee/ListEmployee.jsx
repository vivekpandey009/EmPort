import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { EmployeeButtons } from "../../utils/EmployeeHelper";
import { Link } from "react-router-dom";

const ListEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      name: "Employee Code",
      selector: (row) => row.employeeCode,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.companyEmail,
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <EmployeeButtons
          _id={row._id}
          onEmployeeDelete={handleDelete}
          onError={(error) => alert(error.message)}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/employees", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setEmployees(response.data.employees);
        setFilteredEmployees(response.data.employees);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error fetching employees");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log("Attempting to delete employee with ID:", id);

    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        console.log("Sending delete request for ID:", id);
        const response = await axios.delete(
          `http://localhost:3000/api/employees/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Delete response:", response.data);

        if (response.data.success) {
          console.log("Filtering employees after deletion");
          setEmployees((prev) => prev.filter((emp) => emp._id !== id));
          setFilteredEmployees((prev) => prev.filter((emp) => emp._id !== id));
          alert("Employee deleted successfully");
        }
      } catch (error) {
        console.error("Detailed delete error:", error.response?.data);
        alert(error.response?.data?.error || "Error deleting employee");
      }
    }
  };

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = employees.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(searchTerm) ||
        emp.lastName.toLowerCase().includes(searchTerm) ||
        emp.employeeCode.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm)
    );
    setFilteredEmployees(filtered);
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center p-5">
          <div className="text-xl">Loading...</div>
        </div>
      ) : (
        <div className="p-5">
          <div className="mb-5 text-center">
            <h3 className="text-2xl font-bold text-center">Manage Employees</h3>
          </div>

          <div className="flex items-center justify-between mb-5">
            <input
              type="text"
              placeholder="Search employees..."
              onChange={handleFilter}
              className="px-4 py-2 border-2 border-gray-300 rounded"
            />
            <Link
              to="/admin-dashboard/add-employee"
              className="px-4 py-2 font-semibold text-white rounded bg-sky-500 hover:bg-sky-200 hover:text-sky-800 hover:border-2 hover:border-sky-700"
            >
              Add Employee
            </Link>
          </div>

          <div className="mt-5">
            <DataTable
              columns={columns}
              data={filteredEmployees}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 15, 20, 30, 50]}
              noDataComponent={<div className="p-4">No Employee found</div>}
              dense // This prop will make the table more compact
              compact // This is another option to reduce spacing
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ListEmployee;
