import { useSelector } from "react-redux";
import { Outlet, NavLink } from "react-router-dom";
import { hasPermission } from "../utility/permissions";

const MainLayout = () => {
  const user = useSelector((state) => state.users);
  const userRole = user.role;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">TeamFlow</h1>
        <nav className="flex flex-col gap-4">
          {hasPermission(userRole, "viewDashboard") && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "text-yellow-300" : "text-white"
              }
            >
              Dashboard
            </NavLink>
          )}

          {hasPermission(userRole, "viewOrders") && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? "text-yellow-300" : "text-white"
              }
            >
              Orders
            </NavLink>
          )}

          {hasPermission(userRole, "editSettings") && (
            <NavLink
              to="/setting"
              className={({ isActive }) =>
                isActive ? "text-yellow-300" : "text-white"
              }
            >
              Settings
            </NavLink>
          )}

          {hasPermission(userRole, "viewManagerDashboard") && (
            <NavLink
              to="/manager-dashboard"
              className={({ isActive }) =>
                isActive ? "text-yellow-300" : "text-white"
              }
            >
              Manager Dashboard
            </NavLink>
          )}

          {hasPermission(userRole, "createOrder") && (
            <NavLink
              to="/new-order"
              className={({ isActive }) =>
                isActive ? "text-yellow-300" : "text-white"
              }
            >
              Add New Order/Service
            </NavLink>
          )}

          {hasPermission(userRole, "finalReview") && (
            <NavLink
              to="/final-review"
              className={({ isActive }) =>
                isActive ? "text-yellow-300" : "text-white"
              }
            >
              Final Review
            </NavLink>
          )}
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100">
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">TeamFlow Panel</h2>
          <span className="text-sm text-gray-500">
            Logged in as {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </span>
        </div>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
