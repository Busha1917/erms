import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDevices } from "../../store/devicesSlice";

export default function UserDevices() {
  const dispatch = useDispatch();
  const { list: devices, loading } = useSelector((state) => state.devices);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  // Filter devices to ensure only assigned ones are shown
  const userDevices = devices.filter(d => {
    if (!currentUser) return false;
    const assignedId = d.assignedToId?._id || d.assignedToId?.id || d.assignedToId;
    return String(assignedId) === String(currentUser.id);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Devices</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">Device Name</th>
              <th className="p-4">Type & Model</th>
              <th className="p-4">Serial Number</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr> :
             userDevices.length === 0 ? <tr><td colSpan="4" className="p-4 text-center">No devices registered.</td></tr> :
             userDevices.map((device) => (
              <tr key={device.id || device._id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{device.deviceName}</td>
                <td className="p-4 text-gray-600">{device.type} - {device.model}</td>
                <td className="p-4 font-mono text-sm">{device.serialNumber}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    device.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    device.status === 'In Repair' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {device.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}