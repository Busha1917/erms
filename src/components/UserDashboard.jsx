import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { fetchMyRepairs } from '../store/repairsSlice';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { myRepairs, loading } = useSelector((state) => state.repairs);

  useEffect(() => {
    dispatch(fetchMyRepairs());
  }, [dispatch]);

  // Calculate stats on frontend to ensure real-time reflection of list
  const stats = {
    total: myRepairs?.length || 0,
    pending: myRepairs?.filter(r => r.status === 'Pending').length || 0,
    inProgress: myRepairs?.filter(r => r.status === 'In Progress').length || 0,
    completed: myRepairs?.filter(r => r.status === 'Completed').length || 0,
  };

  const StatCard = ({ label, value, color }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
        <dd className={`mt-1 text-3xl font-semibold ${color}`}>{value}</dd>
      </div>
    </div>
  );

  return (
    <DashboardLayout role="user">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Dashboard</h2>
        <Link 
          to="/user/new-request" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition-colors"
        >
          Request New Repair
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Total Requests" value={stats.total} color="text-gray-900" />
        <StatCard label="Pending" value={stats.pending} color="text-yellow-600" />
        <StatCard label="In Progress" value={stats.inProgress} color="text-blue-600" />
        <StatCard label="Completed" value={stats.completed} color="text-green-600" />
      </div>

      {/* My Requests Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">My Repair Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
              ) : myRepairs?.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">You haven't made any requests yet.</td></tr>
              ) : (
                myRepairs.map((repair) => (
                  <tr key={repair.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{repair.id.slice(-6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{repair.deviceType}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{repair.problemDescription}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${repair.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          repair.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {repair.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(repair.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/user/repair/${repair.id}`} className="text-blue-600 hover:text-blue-900 mr-4">Track</Link>
                      {repair.status === 'Pending' && (
                        <button className="text-red-600 hover:text-red-900">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Timeline for most recent active repair */}
      {myRepairs?.length > 0 && myRepairs[0].status !== 'Completed' && (
        <div className="mt-8 bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Repair Status: #{myRepairs[0].id.slice(-6)}</h3>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            {['Pending', 'Approved', 'In Progress', 'Completed'].map((step, idx) => {
              const isActive = step === myRepairs[0].status;
              const isPast = ['Pending', 'Approved', 'In Progress', 'Completed'].indexOf(myRepairs[0].status) >= idx;
              return (
                <div key={step} className={`flex flex-col items-center bg-white px-2 ${isPast ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-4 h-4 rounded-full ${isPast ? 'bg-blue-600' : 'bg-gray-300'} mb-2`}></div>
                  <span className="text-xs font-bold">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;