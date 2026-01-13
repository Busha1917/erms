import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../store/dashboardSlice";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const { stats, recentActivity, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="text-gray-500 text-sm">My Devices</div>
          <div className="text-3xl font-bold text-gray-800">{stats.devices || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
          <div className="text-gray-500 text-sm">Total Requests</div>
          <div className="text-3xl font-bold text-gray-800">{stats.totalRequests || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <div className="text-gray-500 text-sm">Pending Repairs</div>
          <div className="text-3xl font-bold text-gray-800">{stats.pendingRequests || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="text-gray-500 text-sm">Completed Repairs</div>
          <div className="text-3xl font-bold text-gray-800">{stats.completedRequests || 0}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th className="p-3">Issue</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentActivity.map((activity) => (
                <tr key={activity.id || activity._id}>
                  <td className="p-3 font-medium">{activity.issue}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>{activity.status}</span>
                  </td>
                  <td className="p-3 text-gray-500">{new Date(activity.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentActivity.length === 0 && (
                <tr><td colSpan="3" className="p-4 text-center text-gray-500">No recent activity found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <Link to="/user/requests" className="text-blue-600 hover:underline text-sm">View All Requests &rarr;</Link>
        </div>
      </div>
    </div>
  );
}