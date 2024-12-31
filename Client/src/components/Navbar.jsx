import { useAuth } from "../context/AuthenticationContext";
import LogoutIcon from "@mui/icons-material/Logout";
import { Tooltip, IconButton } from "@mui/material";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <>
      <nav className="flex items-center justify-between h-12 px-5 text-white bg-sky-500 font-Grotesk">
        <div className="justify-between ">
          <span className="flex flex-auto gap-5">
            <p>
              Name: {user.firstname} {user.middlename} {user.lastname}
            </p>

            <p>Emp Id: {user.empCode}</p>
          </span>
        </div>

        <div>
          <Tooltip title="Logout" arrow>
            <button onClick={logout}>
              <LogoutIcon style={{ color: "white" }} />
            </button>
          </Tooltip>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
