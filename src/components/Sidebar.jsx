import { NavLink } from "react-router-dom";

function Sidebar() {
  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "User Management" },
    { to: "/admin/devices", label: "Device Management" },
    { to: "/admin/repairs", label: "Repair Requests" },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 flex flex-col h-screen py-4 px-3">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center">ERMS Admin</h2>
      </div>

      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md transition-colors duration-200 ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700 hover:text-gray-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto text-center">
        <hr className="my-2 border-gray-700" />
        <span className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ERMS.
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;