import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { MdModeEdit, MdOutlineDelete } from "react-icons/md";
import { Tooltip, IconButton } from "@mui/material";

export const DesignationButtons = ({ _id, onDesignationDelete, onError }) => {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this designation?"
    );

    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/designation/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          onDesignationDelete(id);
        } else {
          throw new Error(
            response.data.error || "Failed to delete designation"
          );
        }
      } catch (error) {
        onError(error);
      }
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Tooltip title="Edit Designation" placement="bottom" arrow>
        <IconButton>
          <button
            className="px-3 py-1 text-lg font-bold text-white bg-green-500 rounded hover:bg-green-300 hover:text-sky-700 hover:border hover:border-sky-700"
            onClick={() => navigate(`/admin-dashboard/designation/${_id}`)}
          >
            <MdModeEdit />
          </button>
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete Designation" placement="bottom" arrow>
        <IconButton>
          <button
            className="px-3 py-1 text-lg font-bold text-white bg-red-500 rounded hover:bg-red-300 hover:text-sky-700 hover:border hover:border-sky-700"
            onClick={() => handleDelete(_id)}
          >
            <MdOutlineDelete />
          </button>
        </IconButton>
      </Tooltip>
    </div>
  );
};

DesignationButtons.propTypes = {
  _id: PropTypes.string.isRequired,
  onDesignationDelete: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};
