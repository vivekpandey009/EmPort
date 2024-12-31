import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <>
      <div className="flex font-Grotesk">
        <AdminSidebar />

        <div className="flex-1 ml-64">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
