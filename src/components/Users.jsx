import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser, restoreUser } from '../store/usersSlice';
import UserFormModal from './UserFormModal';

const Users = () => {
  const dispatch = useDispatch();
  const { list: users, loading, error } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers(showDeleted));
  }, [dispatch, showDeleted]);

  const handleAddUser = () => {
    setCurrentUser(null); // Ensure we are in "Create Mode"
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user); // Ensure we are in "Edit Mode"
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const handleRestoreUser = (id) => {
    dispatch(restoreUser(id));
  };

  const handleSaveUser = (userData) => {
    if (userData.id) {
      dispatch(updateUser(userData));
    } else {
      dispatch(addUser(userData));
    }
    setIsModalOpen(false);
  };

  // Safe filtering in case users list is empty initially
  const filteredUsers = (users || []).filter(user =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={handleAddUser}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error.message || JSON.stringify(error)}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
          />
          <span className="text-gray-700">Show Deleted Users</span>
        </label>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">Loading users...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No users found.</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id || user._id} className={`hover:bg-gray-50 ${user.isDeleted ? 'bg-gray-50 opacity-75' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'technician' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!user.isDeleted ? (
                      <>
                        <button onClick={() => handleEditUser(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                        <button onClick={() => handleDeleteUser(user.id || user._id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </>
                    ) : (
                      <button onClick={() => handleRestoreUser(user.id || user._id)} className="text-green-600 hover:text-green-900">Restore</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <UserFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} initialData={currentUser} />
    </div>
  );
};

export default Users;