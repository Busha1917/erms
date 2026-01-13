import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../components/DashboardLayout';
import UserFormModal from '../components/UserFormModal';
// Assuming store actions
import { fetchAdminStats, fetchRecentRepairs, assignTechnician } from '../store/adminSlice';
import { createUser } from '../store/usersSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentRepairs, loading } = useSelector((state) => state.admin);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchRecentRepairs());
  }, [dispatch]);

  const handleCreateUser = (userData) => {
    dispatch(createUser(userData));
  };

  // Simple CSS Bar Chart Component
  const StatusChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="text-gray-500 text-sm">No data available</div>;
    const max = Math.max(...data.map(d => d.count));
    return (
      <div className="flex items-end space-x-4 h-48 pt-6">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center flex-1 group">
            <div className="relative w-full bg-blue-100 rounded-t-md hover:bg-blue-200 transition-all flex items-end justify-center">
              <div 
                className="w-full bg-blue-600 rounded-t-md transition-all duration-500" 
                style={{ height: `${max > 0 ? (d.count / max) * 100 : 0}%` }}
              ></div>
              <span className="absolute -top-6 text-xs font-bold text-gray-600">{d.count}</span>
            </div>
            <span className="text-xs text-gray-600 mt-2 font-medium">{d.status}</span>
          </div>
        ))}
      </div>
    );
  };

  const KPICard = ({ title, value, color, alert }) => (
    <div className={`bg-white rounded-lg shadow p-5 border-l-4 ${color} relative overflow-hidden`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
        {alert && (
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full animate-pulse">
            Action Needed
          </span>
        )}
      </div>
    </div>
  );

  if (loading && !stats) return <div className="flex justify-center items-center h-screen">Loading Dashboard...</div>;

  return (
    <DashboardLayout role="admin">
      {/* Quick Actions */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>
        <div className="space-x-3">
          <button 
            onClick={() => setIsUserModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors text-sm font-medium"
          >
            + Add User
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition-colors text-sm font-medium">
            + Add Inventory
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Users" value={stats?.totalUsers || 0} color="border-blue-500" />
        <KPICard title="Total Technicians" value={stats?.totalTechs || 0} color="border-indigo-500" />
        <KPICard title="Pending Repairs" value={stats?.pendingRepairs || 0} color="border-yellow-500" alert={stats?.pendingRepairs > 5} />
        <KPICard title="Low Stock Items" value={stats?.lowStock || 0} color="border-red-500" alert={stats?.lowStock > 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Charts */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Repairs by Status</h3>
          <StatusChart data={stats?.repairsByStatus || []} />
        </div>

        {/* System Alerts */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">System Alerts</h3>
          <div className="space-y-3">
            {stats?.alerts?.length === 0 ? (
              <p className="text-gray-500">No active system alerts.</p>
            ) : (
              stats?.alerts?.map((alert, idx) => (
                <div key={idx} className="flex items-center p-3 bg-red-50 border border-red-100 rounded text-red-700 text-sm">
                  <span className="font-bold mr-2">!</span> {alert.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Repairs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Recent Repair Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentRepairs?.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No repairs found.</td></tr>
              ) : (
                recentRepairs?.map((repair) => (
                  <tr key={repair.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{repair.id.slice(-6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{repair.deviceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${repair.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          repair.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {repair.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {repair.technicianName || <span className="text-red-400 italic">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(repair.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">Manage</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserFormModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        onSave={handleCreateUser}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;