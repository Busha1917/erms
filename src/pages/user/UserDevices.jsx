import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadSampleData } from "../../store/devicesSlice";

export default function UserDevices() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const devicesList = useSelector((state) => state.devices?.list || []);

  useEffect(() => {
    if (devicesList.length === 0) dispatch(loadSampleData());
  }, [dispatch, devicesList.length]);

  const myDevices = devicesList.filter((d) => d.assignedToId === user?.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Devices</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myDevices.map((device) => (
          <div key={device.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{device.deviceName}</h3>
                <p className="text-sm text-gray-500">SN: {device.serialNumber}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                device.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
              }`}>
                {device.status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p><span className="font-medium">Type:</span> {device.type}</p>
              <p><span className="font-medium">Model:</span> {device.model}</p>
            </div>
            <button
              onClick={() => navigate("/user/new-request", { state: { deviceId: device.id } })}
              disabled={device.status === "Suspended"}
              className={`w-full py-2 rounded transition ${
                device.status === "Suspended" 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {device.status === "Suspended" ? "Suspended" : "Report Issue"}
            </button>
          </div>
        ))}
        {myDevices.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No devices assigned to you.
          </div>
        )}
      </div>
    </div>
  );
}