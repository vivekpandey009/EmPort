import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { DesignationButtons } from "../../utils/DesignationHelper";

const ListDesignation = () => {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredDesignations, setFilteredDesignations] = useState([]);

  const columns = [
    {
      name: "S No.",
      selector: (row) => row.sno,
      sortable: true,
      width: "100px",
    },
    {
      name: "Designation Name",
      selector: (row) => row.designationName,
      sortable: true,
      grow: 2,
    },
    {
      name: "Department",
      selector: (row) => row.departmentName,
      sortable: true,
      grow: 2,
    },
    {
      name: "Action",
      selector: (row) => row.action,
      width: "200px",
    },
  ];

  const handleError = useCallback((error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      alert("Session expired. Please login again.");
    } else {
      alert(error.response?.data?.error || "An error occurred");
    }
  }, []);

  const onDesignationDelete = useCallback((deletedId) => {
    setDesignations((prev) =>
      prev
        .filter((des) => des._id !== deletedId)
        .map((des, index) => ({
          ...des,
          sno: index + 1,
        }))
    );
  }, []);

  const fetchDesignations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/designation",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const data = response.data.designations.map((des, index) => ({
          _id: des._id,
          sno: index + 1,
          designationName: des.designationName,
          departmentName: des.departmentId.departmentName,
          departmentId: des.departmentId._id,
        }));
        setDesignations(data);
        setFilteredDesignations(data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    fetchDesignations();
  }, [fetchDesignations]);

  const designationsWithActions = useMemo(() => {
    return designations.map((des) => ({
      ...des,
      action: (
        <DesignationButtons
          key={des._id}
          _id={des._id}
          onDesignationDelete={onDesignationDelete}
          onError={handleError}
        />
      ),
    }));
  }, [designations, onDesignationDelete, handleError]);

  useEffect(() => {
    setFilteredDesignations(designationsWithActions);
  }, [designationsWithActions]);

  const filterDesignations = useCallback(
    (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const records = designationsWithActions.filter(
        (des) =>
          des.designationName.toLowerCase().includes(searchTerm) ||
          des.departmentName.toLowerCase().includes(searchTerm)
      );
      setFilteredDesignations(records);
    },
    [designationsWithActions]
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
            <h3 className="text-2xl font-bold">Manage Designations</h3>
          </div>

          <div className="flex items-center justify-between mb-5">
            <input
              type="text"
              placeholder="Search Designation"
              className="px-4 py-2 border-2 border-gray-300 rounded"
              onChange={filterDesignations}
            />
            <Link
              to="/admin-dashboard/add-designation"
              className="px-4 py-2 font-semibold text-white rounded bg-sky-500 hover:bg-sky-200 hover:text-sky-800 hover:border-2 hover:border-sky-700"
            >
              Add New Designation
            </Link>
          </div>

          <div className="mt-5">
            <DataTable
              columns={columns}
              data={filteredDesignations}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 15, 20, 30, 50]}
              noDataComponent={<div className="p-4">No designations found</div>}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ListDesignation;
