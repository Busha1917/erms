import { NavLink } from "react-router-dom";

export default function TechnicianSidebar() {
  const linkBase = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
  const active = "bg-blue-600 text-white";
  const inactive = "text-gray-700 hover:bg-gray-100";

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-600">ERMS Tech</h2>
        <p className="text-sm text-gray-500">Technician Portal</p>
      </div>

      <nav className="space-y-2">
        <NavLink to="/technician/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/technician/tasks" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
          🛠 My Tasks
        </NavLink>

        {/* Inventory is read-only for technicians via this view, but they can see stock */}
        <NavLink to="/admin/inventory" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
          📦 Inventory
        </NavLink>

        <NavLink to="/user/settings" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
          ⚙️ Profile
        </NavLink>
      </nav>
    </aside>
  );
}