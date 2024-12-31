import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const handleError = useCallback((error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        alert("Session expired. Please login again.");
      } else {
        alert(error.response.data.error || "An error occurred");
      }
    } else {
      alert("Network error occurred");
    }
  }, []);

  const onDepartmentDelete = useCallback((deletedId) => {
    setDepartments((prevDepartments) => {
      const updatedDepartments = prevDepartments
        .filter((dep) => dep._id !== deletedId)
        .map((dep, index) => ({
          ...dep,
          sno: index + 1,
        }));
      return updatedDepartments;
    });
  }, []);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/department", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const data = response.data.departments.map((dep, index) => ({
          _id: dep._id,
          sno: index + 1,
          departmentName: dep.departmentName,
        }));
        setDepartments(data);
        setFilteredDepartments(data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Use useMemo to create the departments with action buttons
  const departmentsWithActions = useMemo(() => {
    return departments.map((dep) => ({
      ...dep,
      action: (
        <DepartmentButtons
          key={dep._id}
          _id={dep._id}
          onDepartmentDelete={onDepartmentDelete}
          onError={handleError}
        />
      ),
    }));
  }, [departments, onDepartmentDelete, handleError]);

  // Update filtered departments whenever departments change
  useEffect(() => {
    setFilteredDepartments(departmentsWithActions);
  }, [departmentsWithActions]);

  const filterDepartments = useCallback(
    (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const records = departmentsWithActions.filter((dep) =>
        dep.departmentName.toLowerCase().includes(searchTerm)
      );
      setFilteredDepartments(records);
    },
    [departmentsWithActions]
  );

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center p-5">
          <div className="text-xl">Loading...</div>
        </div>
      ) : (
        <div className="p-5">
          <div className="mb-5 text-center">
            <h3 className="text-2xl font-bold">Manage Departments</h3>
          </div>

          <div className="flex items-center justify-between mb-5">
            <input
              type="text"
              placeholder="Search Department"
              className="px-4 py-2 border-2 border-gray-300 rounded"
              onChange={filterDepartments}
            />
            <Link
              to="/admin-dashboard/add-department"
              className="px-4 py-2 font-semibold text-white rounded bg-sky-500 hover:bg-sky-200 hover:text-sky-800 hover:border-2 hover:border-sky-700"
            >
              Add New Department
            </Link>
          </div>

          <div className="mt-5">
            <DataTable
              columns={columns}
              data={filteredDepartments}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 15, 20, 30, 50]}
              noDataComponent={<div className="p-4">No departments found</div>}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
