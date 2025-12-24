import { useEffect, useState, useRef } from "react";

export default function AdminHeader() {
  const [darkMode, setDarkMode] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  /* ---------- dark mode ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  /* ---------- close menu on outside click ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center">
      {/* LEFT */}
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Admin Panel
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Toggle theme"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>

        {/* PROFILE */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              A
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                Admin User
              </div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </button>

          {/* DROPDOWN */}
          {openMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                Settings
              </button>
              <div className="border-t dark:border-gray-700" />
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
