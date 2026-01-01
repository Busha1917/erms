import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
  const active =
    "bg-blue-600 text-white";
  const inactive =
    "text-gray-700 hover:bg-gray-100";

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      {/* LOGO / TITLE */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-600">ERMS Admin</h2>
        <p className="text-sm text-gray-500">Control Panel</p>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          👤 User Management
        </NavLink>

        <NavLink
          to="/admin/devices"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          💻 Device Management
        </NavLink>

        <NavLink
          to="/admin/repairs"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          🛠 Repair Requests
        </NavLink>

        <NavLink
          to="/admin/departments"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          🏢 Departments
        </NavLink>
      </nav>
    </aside>
  );
}
