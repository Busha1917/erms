import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import AdminHeader from "../components/admin/AdminHeader";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1">
        {/* HEADER */}
        <AdminHeader />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
