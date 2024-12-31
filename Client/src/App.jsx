// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import AuthenticationContext from "./context/AuthenticationContext";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBasedRoutes from "./utils/RoleBasedRoutes";

// Lazy load components
const Login = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const EmployeeDashboard = lazy(() => import("./pages/EmployeeDashboard"));
const AdminSummary = lazy(() => import("./components/AdminSummary"));
const DepartmentList = lazy(() =>
  import("./components/departments/DepartmentList")
);
const AddDepartment = lazy(() =>
  import("./components/departments/AddDepartment")
);
const EditDepartment = lazy(() =>
  import("./components/departments/EditDepartment")
);
const ListEmployee = lazy(() => import("./components/employee/ListEmployee"));
const AddEmployee = lazy(() => import("./components/employee/AddEmployee"));
const ListDesignation = lazy(() =>
  import("./components/designation/ListDesignation")
);
const AddDesignation = lazy(() =>
  import("./components/designation/AddDesignation")
);
const EditDesignation = lazy(() =>
  import("./components/designation/EditDesignation")
);
const EditEmployee = lazy(() => import("./components/employee/EditEmployee"));
const ViewEmployee = lazy(() => import("./components/employee/ViewEmployee"));

const LoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
    <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthenticationContext>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Redirect root to admin dashboard */}
            <Route
              path="/"
              element={<Navigate to="/admin-dashboard" replace />}
            />

            {/* Admin routes */}
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoutes>
                  <RoleBasedRoutes requiredRoles={["admin"]}>
                    <AdminDashboard />
                  </RoleBasedRoutes>
                </PrivateRoutes>
              }
            >
              <Route index element={<AdminSummary />} />
              <Route path="departments" element={<DepartmentList />} />
              <Route path="add-department" element={<AddDepartment />} />
              <Route path="department/:id" element={<EditDepartment />} />

              <Route path="designations" element={<ListDesignation />} />
              <Route path="add-designation" element={<AddDesignation />} />
              <Route path="designation/:id" element={<EditDesignation />} />

              <Route path="employees" element={<ListEmployee />} />
              <Route path="add-employee" element={<AddEmployee />} />
              <Route path="edit-employee/:id" element={<EditEmployee />} />
              <Route path="view-employee/:id" element={<ViewEmployee />} />
            </Route>

            {/* Employee routes */}
            <Route
              path="/employee-dashboard"
              element={
                <PrivateRoutes>
                  <RoleBasedRoutes requiredRoles={["employee"]}>
                    <EmployeeDashboard />
                  </RoleBasedRoutes>
                </PrivateRoutes>
              }
            />

            {/* Catch all unmatched routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </AuthenticationContext>
    </BrowserRouter>
  );
}

export default App;
