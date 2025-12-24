import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { markAsRead, markAllAsRead } from "../store/notificationsSlice";

export default function NotificationBell() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.list);
  const currentUser = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter notifications for the current user
  const myNotifications = notifications.filter((n) => {
    if (n.targetUserId === currentUser?.id) return true;
    if (Array.isArray(n.targetRole) && n.targetRole.includes(currentUser?.role)) return true;
    if (n.targetRole === currentUser?.role) return true;
    return false;
  });

  const unreadCount = myNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    const ids = myNotifications.map((n) => n.id);
    dispatch(markAllAsRead(ids));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none">
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b flex justify-between items-center bg-gray-50">
            <span className="font-bold text-gray-700">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-blue-600 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          {myNotifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
          ) : (
            myNotifications.map((n) => (
              <div key={n.id} onClick={() => dispatch(markAsRead(n.id))} className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${n.read ? "opacity-60" : "bg-blue-50"}`}>
                <p className="text-sm text-gray-800">{n.message}</p>
                <p className="text-xs text-gray-500 mt-1">{n.date}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}