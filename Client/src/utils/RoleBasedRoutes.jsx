import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthenticationContext";

// Use default parameter instead of defaultProps
const RoleBasedRoutes = ({ children, requiredRoles = [] }) => {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  console.log("Current user:", user);
  console.log("Required roles:", requiredRoles);

  // Handle loading state
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Updated role checking logic
  if (!hasRole(requiredRoles)) {
    // Redirect based on user role
    const redirectPath =
      user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard";

    console.log("Redirecting to:", redirectPath);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

RoleBasedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

export default RoleBasedRoutes;
