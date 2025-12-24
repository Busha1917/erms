import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadSampleData as loadDevices } from "../../store/devicesSlice";
import { loadSampleData as loadRequests } from "../../store/repairRequestsSlice";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  const devicesList = useSelector((state) => state.devices?.list || []);
  const requestsList = useSelector((state) => state.repairRequests?.list || []);

  useEffect(() => {
    if (devicesList.length === 0) dispatch(loadDevices());
    if (requestsList.length === 0) dispatch(loadRequests());
  }, [dispatch, devicesList.length, requestsList.length]);

  const myDevices = devicesList.filter(d => d.assignedToId === user?.id);
  const myRequests = requestsList.filter(r => r.requestedById === user?.id);
  const pendingRequests = myRequests.filter(r => r.status === "Pending" || r.status === "In Progress");

  const stats = [
    { label: "My Devices", value: myDevices.length, color: "bg-blue-50 text-blue-600" },
    { label: "Active Requests", value: pendingRequests.length, color: "bg-yellow-50 text-yellow-600" },
    { label: "Total Requests", value: myRequests.length, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        {/* MY DEVICES PREVIEW */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">My Assigned Devices</h2>
            <Link to="/user/devices" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {myDevices.slice(0, 3).map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{d.deviceName}</div>
                  <div className="text-xs text-gray-500">SN: {d.serialNumber}</div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{d.status}</span>
              </div>
            ))}
            {myDevices.length === 0 && <p className="text-gray-500 text-sm">No devices assigned.</p>}
          </div>
        </div>

        {/* RECENT REQUESTS PREVIEW */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Requests</h2>
            <Link to="/user/requests" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {myRequests.slice(-3).reverse().map(r => (
              <div key={r.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <div className="font-medium text-gray-900">{r.issue}</div>
                <div className="text-xs text-gray-500 mt-1 flex justify-between"><span>{r.createdAt}</span> <span className="font-semibold">{r.status}</span></div>
              </div>
            ))}
            {myRequests.length === 0 && <p className="text-gray-500 text-sm">No requests found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}