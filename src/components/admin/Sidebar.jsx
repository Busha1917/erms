import { NavLink } from "react-router-dom";

const navItem =
  "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 hidden md:flex flex-col">
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 text-xl font-bold text-blue-600">
        ERMS Admin
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 space-y-1">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`
          }
        >
          User Management
        </NavLink>

        <NavLink
          to="/admin/devices"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`
          }
        >
          Device Management
        </NavLink>

        <NavLink
          to="/admin/repairs"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`
          }
        >
          Repair Requests
        </NavLink>
      </nav>
    </aside>
  );
}
