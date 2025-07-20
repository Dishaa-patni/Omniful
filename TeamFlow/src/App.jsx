import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/AdminDashboard";
import NewOrderPage from "./pages/NewOrderPage";
import OrderPage from "./pages/OrderPage";
import SettingPage from "./pages/SettingPage";
import MainLayout from "./layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerFinalReviewPage from "./pages/ManagerFinalReviewPage";
import HistoryPage from "./pages/HistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";

const RoleBasedRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  } else if (user.role === "manager") {
    return <Navigate to="/manager-dashboard" replace />;
  } else if (user.role === "employee") {
    return <Navigate to="/history" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleBasedRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute resource="Dashboard" action="read">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute resource="Order" action="read">
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <ProtectedRoute resource="Settings" action="manage">
              <SettingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute resource="ManagerDashboard" action="read">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-order"
          element={
            <ProtectedRoute resource="Order" action="create">
              <NewOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/final-review"
          element={
            <ProtectedRoute resource="FinalReview" action="read">
              <ManagerFinalReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute resource="History" action="read">
              <HistoryPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
