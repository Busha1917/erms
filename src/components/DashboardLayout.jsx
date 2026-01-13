import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
// Assuming these actions exist in your store
import { logout } from '../store/authSlice';
import NotificationBell from './NotificationBell';

const DashboardLayout = ({ children, role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const NavItem = ({ to, label, icon }) => (
    <Link to={to} className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );

  // Simple SVG Icons
  const Icons = {
    Dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Repairs: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Bell: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    Logout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold text-center border-b border-gray-700">ERMS</div>
        <nav className="flex-1 mt-6">
          <NavItem to={`/${role}/dashboard`} label="Dashboard" icon={Icons.Dashboard} />
          
          {role === 'admin' && (
            <>
              <NavItem to="/admin/users" label="Users & Techs" icon={Icons.Users} />
              <NavItem to="/admin/inventory" label="Inventory" icon={Icons.Repairs} />
            </>
          )}
          
          {role === 'user' && (
            <NavItem to="/user/requests" label="My Requests" icon={Icons.Repairs} />
          )}

          {role === 'technician' && (
            <NavItem to="/tech/schedule" label="Work Schedule" icon={Icons.Repairs} />
          )}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-gray-700 rounded transition-colors">
            <span className="mr-3">{Icons.Logout}</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800 capitalize">{role} Dashboard</h1>
            
            <div className="flex items-center space-x-6">
              {/* Notifications */}
              <NotificationBell />

              {/* User Profile */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="ml-2 text-gray-700 font-medium">{user?.name || 'User'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;