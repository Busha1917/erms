import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadSampleData as loadDevices } from "../../store/devicesSlice";
import { addRequest } from "../../store/repairRequestsSlice";
import RepairRequestFormModal from "../../components/RepairRequestFormModal";

export default function UserDevices() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const devicesList = useSelector((state) => state.devices?.list || []);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    if (devicesList.length === 0) dispatch(loadDevices());
  }, [dispatch, devicesList.length]);

  const myDevices = devicesList.filter((d) => d.assignedToId === user?.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Devices</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myDevices.map((d) => (
          <div key={d.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                {d.deviceName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{d.deviceName}</h3>
                <p className="text-sm text-gray-500">SN: {d.serialNumber}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Department: <span className="font-medium">{d.department}</span></p>
              <p>Status: <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">{d.status}</span></p>
            </div>
            <button
              onClick={() => setSelectedDevice(d)}
              className="mt-4 w-full py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition text-sm font-medium"
            >
              Report Issue
            </button>
          </div>
        ))}
        {myDevices.length === 0 && <p className="text-gray-500 col-span-3 text-center py-10">No devices are currently assigned to you.</p>}
      </div>

      <RepairRequestFormModal
        open={!!selectedDevice}
        request={{ deviceId: selectedDevice?.id }}
        isUserView={true}
        onClose={() => setSelectedDevice(null)}
        onSave={(formData) => {
          dispatch(addRequest({ ...formData, id: Date.now(), createdAt: new Date().toISOString().split("T")[0], lastUpdated: "-", isDeleted: false }));
          setSelectedDevice(null);
        }}
      />
    </div>
  );
}