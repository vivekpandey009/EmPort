// AuthenticationContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import axios from "axios";

const UserContext = createContext();

// Define permission types
const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  MANAGE_USERS: "manage_users",
  MANAGE_LEAVES: "manage_leaves",
  MANAGE_ATTENDANCE: "manage_attendance",
};

const AuthenticationContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modified hasRole function
  const hasRole = useCallback(
    (requiredRoles) => {
      if (!user) return false;

      if (Array.isArray(requiredRoles)) {
        return requiredRoles.includes(user.role);
      }

      return user.role === requiredRoles;
    },
    [user]
  );

  // Add hasPermission function
  const hasPermission = useCallback(
    (requiredPermission) => {
      if (!user || !user.permissions) return false;

      // Handle array of permissions
      if (Array.isArray(requiredPermission)) {
        return requiredPermission.every((permission) =>
          user.permissions.includes(permission)
        );
      }

      // Handle single permission
      return user.permissions.includes(requiredPermission);
    },
    [user]
  );

  // Improved verification
  const verifyUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/auth/verify",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError(error.response?.data?.message || "Authentication failed");
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function with error handling
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        credentials
      );

      if (response.data.success) {
        const { token, user } = response.data;

        // Store token
        localStorage.setItem("token", token);

        // Set user data
        setUser(user);

        return {
          success: true,
          user,
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
  }, []);

  // Effect for initial verification
  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const value = {
    user,
    login,
    logout: handleLogout,
    loading,
    error,
    hasRole,
    hasPermission,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

AuthenticationContext.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthenticationContext");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { PERMISSIONS };

export default AuthenticationContext;
