import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadSampleData as loadRequests } from "../../store/repairRequestsSlice";
import { loadSampleData as loadDevices } from "../../store/devicesSlice";
import { Link } from "react-router-dom";

export default function TechnicianDashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const requestsList = useSelector((state) => state.repairRequests?.list || []);
  const devicesList = useSelector((state) => state.devices?.list || []);

  useEffect(() => {
    if (requestsList.length === 0) dispatch(loadRequests());
    if (devicesList.length === 0) dispatch(loadDevices());
  }, [dispatch, requestsList.length, devicesList.length]);

  const myTasks = requestsList.filter(r => r.assignedToId === user?.id && !r.isDeleted);
  const pendingTasks = myTasks.filter(r => r.status === "Pending" || r.status === "In Progress");
  const completedTasks = myTasks.filter(r => r.status === "Completed");
  const highPriorityTasks = pendingTasks.filter(r => r.priority === "High" || r.priority === "Urgent");
  const overdueTasks = pendingTasks.filter(r => r.deadline && new Date(r.deadline) < new Date());

  const stats = [
    { label: "Pending Tasks", value: pendingTasks.length, color: "bg-yellow-50 text-yellow-600" },
    { label: "High Priority", value: highPriorityTasks.length, color: "bg-red-50 text-red-600" },
    { label: "Completed", value: completedTasks.length, color: "bg-green-50 text-green-600" },
    { label: "Overdue", value: overdueTasks.length, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Technician Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.color} font-bold text-xl`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* URGENT TASKS */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Urgent & High Priority</h2>
            <Link to="/technician/tasks" className="text-sm text-indigo-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {highPriorityTasks.slice(0, 5).map(r => {
               const device = devicesList.find(d => d.id === r.deviceId);
               return (
                <div key={r.id} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">{device?.deviceName || "Unknown Device"}</span>
                    <span className="text-xs font-bold text-red-700 uppercase">{r.priority}</span>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">{r.issue}</div>
                  <div className="text-xs text-gray-500 mt-2">Assigned: {r.createdAt}</div>
                </div>
               );
            })}
            {highPriorityTasks.length === 0 && <p className="text-gray-500 text-sm">No high priority tasks pending.</p>}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Notifications & Alerts</h2>
          <div className="space-y-3">
            {overdueTasks.length > 0 && (
              <div className="p-3 bg-orange-50 text-orange-800 rounded-lg text-sm border border-orange-100">
                <strong>Alert:</strong> You have {overdueTasks.length} overdue tasks. Please review them immediately.
              </div>
            )}
            <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
              <strong>System:</strong> Weekly maintenance scheduled for Friday 10 PM.
            </div>
            {myTasks.slice(0, 2).map(task => (
               <div key={task.id} className="p-3 bg-gray-50 text-gray-700 rounded-lg text-sm">
                 <strong>Assignment:</strong> New task #{task.id} assigned to you.
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* WORKLOAD SUMMARY */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Workload Summary (Weekly)</h2>
        <div className="flex items-end gap-4 h-40">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
            <div key={day} className="flex-1 bg-indigo-100 rounded-t-lg relative group hover:bg-indigo-200 transition-all" style={{ height: `${Math.max(20, Math.random() * 100)}%` }}>
              <div className="absolute bottom-0 w-full text-center text-xs text-gray-600 mb-[-20px]">{day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}