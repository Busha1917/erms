import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchNotifications, markAsRead, markAllAsRead } from "../store/notificationsSlice";

export default function NotificationBell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector((state) => state.notifications.list);
  const user = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [dispatch]);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
    dispatch(markAllAsRead());
  };

  const handleNotificationClick = (notification) => {
    // 1. Mark as read
    if (!notification.read) {
      dispatch(markAsRead(notification._id || notification.id));
    }
    setIsOpen(false);

    // 2. Navigate based on type and role
    const role = user?.role;
    
    // Robust ID extraction: handle object with _id/id or string
    let entityId = notification.relatedEntity;
    if (entityId && typeof entityId === 'object') {
      entityId = entityId._id || entityId.id;
    }

    // Safety Check: If no ID is found for entity-specific notifications, warn and fallback
    if (!entityId && notification.type !== 'GENERAL') {
      console.warn("Notification click aborted: Missing entity ID", notification);
      // Fallback to dashboard if we can't navigate to a specific item
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'technician') navigate('/technician/dashboard');
      else navigate('/user/dashboard');
      return;
    }

    switch (notification.type) {
      // --- REPAIR EVENTS ---
      case 'REPAIR_CREATED':
      case 'REPAIR_STATUS_CHANGE':
      case 'REPAIR_ASSIGNED':
      case 'REPAIR_CANCELLED':
      case 'REPAIR_COMPLETED':
      case 'REPAIR_OVERDUE':
        if (role === 'admin') navigate('/admin/requests', { state: { highlightId: entityId } });
        else if (role === 'technician') navigate('/technician/tasks', { state: { highlightId: entityId } });
        else if (role === 'user') navigate(`/user/repair/${entityId}`);
        break;
      
      // --- INVENTORY EVENTS ---
      case 'INVENTORY_LOW':
      case 'INVENTORY_OUT':
        if (role === 'admin' || role === 'technician') navigate('/admin/inventory', { state: { highlightId: entityId } });
        break;

      // --- USER EVENTS ---
      case 'USER_REGISTERED':
        if (role === 'admin') navigate('/admin/users', { state: { highlightId: entityId } });
        break;

      default:
        // Default fallback
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'technician') navigate('/technician/dashboard');
        else navigate('/user/dashboard');
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
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
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n._id || n.id} 
                onClick={() => handleNotificationClick(n)} 
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${n.read ? "bg-white" : "bg-blue-50"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className={`text-sm text-gray-800 ${!n.read ? "font-bold" : "font-normal"}`}>{n.title || "Notification"}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{getTimeAgo(n.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}