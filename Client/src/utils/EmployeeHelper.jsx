import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Tooltip, IconButton } from "@mui/material";
import {
  MdModeEdit,
  MdOutlineDelete,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import axios from "axios";

export const deleteEmployee = async (id, token) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/employees/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error deleting employee");
  }
};

export const EmployeeButtons = ({ _id, onEmployeeDelete, onError }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      // Remove the confirmation here since it's already in ListEmployee
      await deleteEmployee(_id, localStorage.getItem("token"));
      onEmployeeDelete(_id);
    } catch (error) {
      onError(error);
    }
  };

  // export const EmployeeButtons = ({ employee, onDelete, onError }) => {
  //   const navigate = useNavigate();

  //   const handleDelete = async (id) => {
  //     const confirm = window.confirm(
  //       "Are you sure you want to delete this designation?"
  //     );

  //     if (confirm) {
  //       try {
  //         const response = await axios.delete(
  //           `http://localhost:3000/api/designation/${id}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${localStorage.getItem("token")}`,
  //             },
  //           }
  //         );

  //         if (response.data.success) {
  //           onDelete(id);
  //         } else {
  //           throw new Error(
  //             response.data.error || "Failed to delete designation"
  //           );
  //         }
  //       } catch (error) {
  //         onError(error);
  //       }
  //     }
  //   };

  return (
    <div className="flex items-center space-x-3">
      <Tooltip title="View Employee" placement="bottom" arrow>
        <IconButton>
          <button
            onClick={() => navigate(`/admin-dashboard/view-employee/${_id}`)}
            className="px-3 py-1 text-lg font-bold text-white bg-blue-500 rounded hover:bg-blue-300 hover:text-sky-700 hover:border hover:border-sky-700"
          >
            <MdOutlineRemoveRedEye />
          </button>
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit Employee" placement="bottom" arrow>
        <IconButton>
          <button
            onClick={() => navigate(`/admin-dashboard/edit-employee/${_id}`)}
            className="px-3 py-1 text-lg font-bold text-white bg-green-500 rounded hover:bg-green-300 hover:text-sky-700 hover:border hover:border-sky-700"
          >
            <MdModeEdit />
          </button>
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete Employee" placement="bottom" arrow>
        <IconButton>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-lg font-bold text-white bg-red-500 rounded hover:bg-red-300 hover:text-sky-700 hover:border hover:border-sky-700"
          >
            <MdOutlineDelete />
          </button>
        </IconButton>
      </Tooltip>
    </div>
  );
};
// Props validation
EmployeeButtons.propTypes = {
  _id: PropTypes.string.isRequired, // Corrected
  onEmployeeDelete: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};
