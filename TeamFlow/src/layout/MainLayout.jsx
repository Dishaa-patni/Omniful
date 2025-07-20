import { useSelector, useDispatch } from "react-redux";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAbility } from "../utility/AbilityContext.jsx";
import { logout } from "../features/userSlice";
import { useState } from "react";

import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  Users,
  PlusCircle,
  CheckCircle,
  History,
  Menu,
  X,
} from "lucide-react";

const MainLayout = () => {
  const user = useSelector((state) => state.users);
  const ability = useAbility();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="lg:hidden bg-white shadow px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-orange-700 hover:bg-orange-100 cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <aside
        className={`
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        fixed lg:static inset-y-0 left-0 z-50
        w-64 min-h-screen bg-[#FFF6ED] text-[#D35400] p-6 shadow-md
        transition-transform duration-300 ease-in-out
        lg:transition-none
      `}
      >
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h1 className="text-2xl font-bold">TeamFlow</h1>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-orange-700 hover:bg-orange-100 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6 hidden lg:block">TeamFlow</h1>

        <nav className="flex flex-col gap-4">
          {ability.can("read", "Dashboard") && (
            <NavItem
              to="/admin-dashboard"
              label="Dashboard"
              icon={LayoutDashboard}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {ability.can("read", "Order") && (
            <NavItem
              to="/orders"
              label="Orders"
              icon={ClipboardList}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {ability.can("manage", "Settings") && (
            <NavItem
              to="/setting"
              label="Settings"
              icon={Settings}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {ability.can("read", "ManagerDashboard") && (
            <NavItem
              to="/manager-dashboard"
              label="Manager Dashboard"
              icon={Users}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {ability.can("create", "Order") && (
            <NavItem
              to="/new-order"
              label="Add New Order/Service"
              icon={PlusCircle}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {ability.can("read", "FinalReview") && (
            <NavItem
              to="/final-review"
              label="Final Review"
              icon={CheckCircle}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {ability.can("read", "History") && (
            <NavItem
              to="/history"
              label="History"
              icon={History}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </nav>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 bg-gray-100 min-h-screen">
        <div className="bg-white shadow px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-orange-700">
              TeamFlow Panel
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Welcome, {user.name}!</span>
                <span className="ml-2 text-gray-400">
                  ({user.role.charAt(0).toUpperCase() + user.role.slice(1)})
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
              >
                <span>🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ to, label, icon: Icon, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 font-medium ${
          isActive
            ? "bg-orange-100 text-yellow-600 shadow-inner"
            : "hover:bg-orange-200 hover:text-orange-900 hover:shadow-md"
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
};

export default MainLayout;
