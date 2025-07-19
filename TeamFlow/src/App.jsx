import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import NewOrderPage from "./pages/NewOrderPage";
import OrderPage from "./pages/OrderPage";
import SettingPage from "./pages/SettingPage";
import MainLayout from "./layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerFinalReviewPage from "./pages/ManagerFinalReviewPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/orders" element={<OrderPage />} />

        <Route path="/setting" element={<SettingPage />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/new-order" element={<NewOrderPage />} />
        <Route path="/final-review" element={<ManagerFinalReviewPage />} />
      </Route>
    </Routes>
  );
}

export default App;
