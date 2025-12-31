import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadSampleData as loadRequests } from "../../store/repairRequestsSlice";
import { loadSampleData as loadDevices } from "../../store/devicesSlice";
import RepairRequestFormModal from "../../components/RepairRequestFormModal";

export default function UserRequests() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const requestsList = useSelector((state) => state.repairRequests?.list || []);
  const devicesList = useSelector((state) => state.devices?.list || []);

  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    if (requestsList.length === 0) dispatch(loadRequests());
    if (devicesList.length === 0) dispatch(loadDevices());
  }, [dispatch, requestsList.length, devicesList.length]);

  const myRequests = requestsList.filter((r) => r.requestedById === user?.id);

  // Sort by date descending
  const sortedRequests = [...myRequests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Repair Requests</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">Device</th>
              <th className="p-4">Issue</th>
              <th className="p-4">Date Submitted</th>
              <th className="p-4">Status</th>
              <th className="p-4">Stage</th>
              <th className="p-4">Notes</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedRequests.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">You haven't submitted any requests yet.</td>
                <td colSpan="7" className="p-6 text-center text-gray-500"></td>
              </tr>
            )}
            {sortedRequests.map((r) => {
              const device = devicesList.find((d) => d.id === r.deviceId);
              return (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{device?.deviceName || "Unknown Device"}</td>
                  <td className="p-4">{r.issue}</td>
                  <td className="p-4 text-gray-500">{r.createdAt}</td>
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
                  <td className="p-4 text-sm text-gray-600">{r.repairStage || "-"}</td>
                  <td className="p-4 text-gray-500 text-sm">{r.notes || "-"}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedRequest(r)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Track Status
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <RepairRequestFormModal
        open={!!selectedRequest}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        isUserView={true}
      />
    </div>
  );
}