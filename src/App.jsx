import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./components/AdminLayout";
import UserLayout from "./components/UserLayout";
import TechnicianLayout from "./components/TechnicianLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Devices from "./pages/admin/Devices";
import RepairRequests from "./pages/admin/RepairRequests";
import AdminNewRequest from "./pages/admin/AdminNewRequest";
import AdminRequestDetails from "./pages/admin/AdminRequestDetails";
import Inventory from "./pages/admin/Inventory";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import UserDashboard from "./pages/user/UserDashboard";
import UserRequests from "./pages/user/UserRequests";
import UserDevices from "./pages/user/UserDevices";
import UserNewRequest from "./pages/user/UserNewRequest";
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import TechnicianTasks from "./pages/technician/TechnicianTasks";
import TechnicianManageTask from "./pages/technician/TechnicianManageTask";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="devices" element={<Devices />} />
          <Route path="requests" element={<RepairRequests />} />
          <Route path="requests/new" element={<AdminNewRequest />} />
          <Route path="requests/:id" element={<AdminRequestDetails />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="new-request" element={<UserNewRequest />} />
          <Route path="requests" element={<UserRequests />} />
          <Route path="devices" element={<UserDevices />} />
        </Route>
        <Route
          path="/technician"
          element={
            <ProtectedRoute>
              <TechnicianLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TechnicianDashboard />} />
          <Route path="tasks" element={<TechnicianTasks />} />
          <Route path="tasks/:id" element={<TechnicianManageTask />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}