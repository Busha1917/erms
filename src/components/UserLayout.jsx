import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, login } from "../store/authSlice";
import { updateUser } from "../store/usersSlice";
import UserSidebar from "./UserSidebar";
import NotificationBell from "./NotificationBell";
import UserFormModal from "./UserFormModal";

export default function UserLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/user/dashboard" },
    { name: "My Devices", path: "/user/devices" },
    { name: "My Requests", path: "/user/requests" },
    { name: "New Request", path: "/user/new-request" },
    { name: "Settings", path: "/user/settings" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {navItems.find((i) => i.path === location.pathname)?.name || "User Portal"}
          </h2>

          <div className="flex items-center gap-4">
            <NotificationBell />
            
            {/* PROFILE DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="text-gray-700 font-medium">{user?.name || "User"}</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">Signed in as <br/><span className="font-bold text-gray-800">{user?.email}</span></div>
                  <button
                    onClick={() => { setShowProfileModal(true); setIsProfileOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Your Profile
                  </button>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>

        {/* PROFILE MODAL */}
        <UserFormModal
          isOpen={showProfileModal}
          initialData={user}
          isProfileView={true}
          onClose={() => setShowProfileModal(false)}
          onSave={(formData) => {
            dispatch(updateUser(formData));
            dispatch(login(formData)); // Update local auth state
            setShowProfileModal(false);
          }}
        />
      </div>
    </div>
  );
}