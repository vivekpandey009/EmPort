import { useAuth } from "../context/AuthenticationContext";
import Navbar from "../components/Navbar";

const EmployeeDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="font-Grotesk">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <div className="mt-4">
          <p>
            Welcome, {user?.firstname} {user?.lastname}
          </p>
          <p>Employee Code: {user?.empCode}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
