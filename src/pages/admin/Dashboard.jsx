import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  // Use optional chaining (?.) to safely access state slices
  // This prevents the "Cannot read properties of undefined" error
  const devices = useSelector((state) => state.devices?.list || []);
  const users = useSelector((state) => state.users?.list || []);
  const repairRequests = useSelector((state) => state.repairRequests?.list || []);

  // --- Stats Calculation ---
  const stats = [
    { 
      label: "Total Devices", 
      value: devices.length, 
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bg: "bg-blue-50",
    },
    { 
      label: "Total Users", 
      value: users.length, 
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bg: "bg-purple-50",
    },
    { 
      label: "Pending Requests", 
      value: repairRequests.filter(r => r.status === "Pending").length, 
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: "bg-yellow-50",
    },
    { 
      label: "Active Repairs", 
      value: repairRequests.filter(r => r.status === "In Progress").length, 
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      bg: "bg-indigo-50",
    },
  ];

  // --- Chart Data ---
  const statusData = useMemo(() => {
    const counts = { Pending: 0, "In Progress": 0, Completed: 0, Rejected: 0 };
    repairRequests.forEach((r) => {
      if (counts[r.status] !== undefined) counts[r.status]++;
    });
    return Object.keys(counts).map((key) => ({ name: key, value: counts[key] }));
  }, [repairRequests]);

  const COLORS = ["#FBBF24", "#3B82F6", "#10B981", "#EF4444"];

  const deptData = useMemo(() => {
    const counts = {};
    devices.forEach((d) => {
      const dept = d.department || "Unknown";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({ name: key, count: counts[key] }));
  }, [devices]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
      </div>
      
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                {stat.label}
              </div>
              <div className="text-3xl font-bold text-gray-900 mt-1">
                {stat.value}
              </div>
            </div>
            <div className={`p-3 rounded-full ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Repair Requests by Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Devices by Department</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">Recent Repair Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase font-semibold">
              <tr>
                <th className="p-4">Device</th>
                <th className="p-4">Issue</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {repairRequests
                .slice()
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                .slice(0, 5)
                .map((r) => {
                  const device = devices.find(d => d.id === r.deviceId);
                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium">{device?.deviceName || "Unknown Device"}</td>
                      <td className="p-4">{r.issue}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                          r.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                          r.status === "Completed" ? "bg-green-100 text-green-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{r.createdAt}</td>
                    </tr>
                  );
                })}
              {repairRequests.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">No recent requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
