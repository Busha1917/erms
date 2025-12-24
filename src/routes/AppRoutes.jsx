import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminRepairs from "../pages/admin/Repairs";

import TechnicianRepairs from "../pages/technician/Repairs";
import UserRequests from "../pages/user/Requests";

function AppRoutes() {
  // TEMPORARY MOCK LOGIN
  const currentUser = { role: "admin" };

  return (
    <Router>
      <Routes>

        {/* DEFAULT ROUTE */}
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/repairs" element={<AdminRepairs />} />

        {/* TECHNICIAN ROUTES */}
        <Route path="/technician/repairs" element={<TechnicianRepairs />} />

        {/* USER ROUTES */}
        <Route path="/user/requests" element={<UserRequests />} />

        {/* FALLBACK */}
        <Route path="*" element={<h1>Page Not Found</h1>} />

      </Routes>
    </Router>
  );
}

export default AppRoutes;
