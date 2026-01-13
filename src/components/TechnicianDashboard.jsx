import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../components/DashboardLayout';
import { fetchAssignedRepairs, updateRepairStatus } from '../store/technicianSlice';

const TechnicianDashboard = () => {
  const dispatch = useDispatch();
  const { assignedRepairs, stats, loading } = useSelector((state) => state.technician);

  useEffect(() => {
    dispatch(fetchAssignedRepairs());
  }, [dispatch]);

  const handleStatusUpdate = (id, newStatus) => {
    dispatch(updateRepairStatus({ id, status: newStatus }));
  };

  const WorkloadCard = ({ title, count, color }) => (
    <div className={`bg-white p-4 rounded-lg shadow border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase">{title}</p>
          <h2 className="text-3xl font-bold text-gray-800">{count}</h2>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout role="technician">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Technician Workspace</h2>
        <p className="text-gray-600">Manage your assigned repairs and track performance.</p>
      </div>

      {/* Workload Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <WorkloadCard title="Assigned Jobs" count={stats?.assigned || 0} color="border-blue-500" />
        <WorkloadCard title="In Progress" count={stats?.inProgress || 0} color="border-yellow-500" />
        <WorkloadCard title="Completed (Month)" count={stats?.completedMonth || 0} color="border-green-500" />
        <WorkloadCard title="Avg Repair Time" count={`${stats?.avgTime || 0}h`} color="border-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Repairs Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Active Work Queue</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {assignedRepairs?.length || 0} Jobs
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr>
                ) : assignedRepairs?.length === 0 ? (
                  <tr><td colSpan="4" className="p-4 text-center text-gray-500">No active repairs assigned.</td></tr>
                ) : (
                  assignedRepairs.map((repair) => (
                    <tr key={repair.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{repair.deviceType}</div>
                        <div className="text-xs text-gray-500">#{repair.id.slice(-6)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${repair.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                          {repair.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {repair.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {repair.status !== 'Completed' && (
                          <select 
                            className="text-sm border-gray-300 rounded shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            value={repair.status}
                            onChange={(e) => handleStatusUpdate(repair.id, e.target.value)}
                          >
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Snapshot / Notes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Notes</h3>
          <textarea className="w-full h-40 p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Personal scratchpad for repair notes..."></textarea>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TechnicianDashboard;