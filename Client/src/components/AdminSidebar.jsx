import { NavLink } from "react-router-dom";
import {
  TbLayoutDashboardFilled,
  TbUserSearch,
  TbCalendarCog,
  TbSettings,
} from "react-icons/tb";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaPenNib } from "react-icons/fa";
import { VscGistSecret } from "react-icons/vsc";

const AdminSidebar = () => {
  return (
    <>
      <aside className="fixed top-0 bottom-0 left-0 w-64 h-screen space-y-2 text-sky-500 bg-slate-900">
        <div className="flex items-center justify-center h-12 bg-sky-500">
          <h3 className="text-2xl font-bold text-center text-white font-Pacifico">
            EmPort
          </h3>
        </div>

        <div className="px-4">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `${
                isActive ? "bg-sky-500 m-auto text-white font-bold" : " "
              } flex items-center block space-x-4 text-xl py-2.5 px-4 rounded `
            }
            end
          >
            <TbLayoutDashboardFilled />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/employees"
            className={({ isActive }) =>
              `${
                isActive ? "bg-sky-500 m-auto text-white font-bold" : " "
              } flex items-center block space-x-4 text-xl py-2.5 px-4 rounded `
            }
            end
          >
            <TbUserSearch />
            <span>Employee</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/departments"
            className={({ isActive }) =>
              `${
                isActive ? "bg-sky-500 m-auto text-white font-bold" : " "
              } flex items-center block space-x-4 text-xl py-2.5 px-4 rounded `
            }
          >
            <HiOutlineBuildingOffice2 />
            <span>Department</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/designations"
            className={({ isActive }) =>
              `${
                isActive ? "bg-sky-500 m-auto text-white font-bold" : " "
              } flex items-center block space-x-4 text-xl py-2.5 px-4 rounded `
            }
          >
            <FaPenNib />
            <span>Designation</span>
          </NavLink>

          {/* <NavLink
            to="/admin-dashboard/salary"
            className="flex items-center block space-x-4 text-xl py-2.5 px-4 rounded"
          >
            <TbCurrencyRupee />
            <span>Salary</span>
          </NavLink> */}

          <NavLink
            to="/admin-dashboard/leave"
            className="flex items-center block space-x-4 text-xl py-2.5 px-4 rounded"
          >
            <TbCalendarCog />
            <span>Leave</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/secrets"
            className="flex items-center block space-x-4 text-xl py-2.5 px-4 rounded"
          >
            <VscGistSecret />
            <span>Secrets</span>
          </NavLink>

          <NavLink
            to="/settings"
            className="flex items-center block space-x-4 text-xl py-2.5 px-4 rounded"
          >
            <TbSettings />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
