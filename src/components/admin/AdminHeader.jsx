import { useEffect, useState } from "react";

export default function AdminHeader() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-end px-6 gap-4">
      {/* THEME TOGGLE */}
      <button
        onClick={() => setDark(!dark)}
        className="px-3 py-1 text-sm rounded border dark:border-gray-600"
      >
        {dark ? "Light Mode" : "Dark Mode"}
      </button>

      {/* ADMIN PROFILE */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          A
        </div>
        <div className="text-sm">
          <div className="font-medium text-gray-800 dark:text-gray-200">
            Admin
          </div>
          <div className="text-xs text-gray-500">
            System Administrator
          </div>
        </div>
      </div>
    </header>
  );
}
