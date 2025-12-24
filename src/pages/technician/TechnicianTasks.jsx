import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateRequest, loadSampleData as loadRequests } from "../../store/repairRequestsSlice";
import { loadSampleData as loadDevices } from "../../store/devicesSlice";
import { loadSampleData as loadUsers } from "../../store/usersSlice";

export default function TechnicianTasks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const requestsList = useSelector((state) => state.repairRequests?.list || []);
  const devicesList = useSelector((state) => state.devices?.list || []);
  const usersList = useSelector((state) => state.users?.list || []);

  const [historyDevice, setHistoryDevice] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Pending");

  useEffect(() => {
    if (requestsList.length === 0) dispatch(loadRequests());
    if (devicesList.length === 0) dispatch(loadDevices());
    if (usersList.length === 0) dispatch(loadUsers());
  }, [dispatch, requestsList.length, devicesList.length, usersList.length]);

  const myTasks = requestsList.filter(r => r.assignedToId === user?.id && !r.isDeleted);
  
  const filteredTasks = filterStatus === "All" 
    ? myTasks 
    : myTasks.filter(r => {
        if (filterStatus === "Pending") return r.status === "Pending" || r.status === "In Progress";
        return r.status === filterStatus;
      });

  const handleAccept = (request) => {
    dispatch(updateRequest({ ...request, accepted: true, status: "In Progress", repairStage: "Diagnosing" }));
  };

  const handleReject = (request) => {
    // In a real app, this might open a modal for reason
    dispatch(updateRequest({ ...request, assignedToId: null, status: "Pending", notes: request.notes + " [Rejected by Technician]" }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Assigned Tasks</h1>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-3 py-2 bg-white"
        >
          <option value="Pending">Active (Pending/In Progress)</option>
          <option value="Completed">Completed</option>
          <option value="All">All Tasks</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map(r => {
          const device = devicesList.find(d => d.id === r.deviceId);
          const requester = usersList.find(u => u.id === r.requestedById);
          
          return (
            <div key={r.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    r.priority === "Urgent" ? "bg-red-100 text-red-700" :
                    r.priority === "High" ? "bg-orange-100 text-orange-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {r.priority}
                  </span>
                  <span className="text-sm text-gray-500">ID: #{r.id}</span>
                  <span className="text-sm text-gray-500">{r.createdAt}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{r.issue}</h3>
                <p className="text-gray-600 mt-1">Device: <span className="font-medium">{device?.deviceName}</span> (SN: {device?.serialNumber})</p>
                <p className="text-gray-600">Requester: {requester?.name} ({requester?.department})</p>
                
                <div className="mt-3 flex gap-4 text-sm text-gray-600">
                   {r.deadline && <span><strong>Deadline:</strong> {r.deadline}</span>}
                   {r.repairStage && <span><strong>Stage:</strong> {r.repairStage}</span>}
                </div>

                {r.adminInstructions && (
                  <div className="mt-2 text-sm bg-yellow-50 p-2 rounded text-yellow-800 border border-yellow-100">
                    <strong>Admin Instructions:</strong> {r.adminInstructions}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center items-end gap-2 min-w-[150px]">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  r.status === "Completed" ? "bg-green-100 text-green-800" :
                  r.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                  !r.accepted ? "bg-purple-100 text-purple-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {!r.accepted ? "New Assignment" : r.status}
                </span>

                {!r.accepted ? (
                  <div className="flex gap-2 w-full">
                    <button onClick={() => handleAccept(r)} className="flex-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Accept</button>
                    <button onClick={() => handleReject(r)} className="flex-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Reject</button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => navigate(`/technician/tasks/${r.id}`)}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition font-medium"
                    >
                      Manage Repair
                    </button>
                    <button 
                      onClick={() => setHistoryDevice(device)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                    >
                      View History
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {filteredTasks.length === 0 && <p className="text-center text-gray-500 py-10">No tasks found in this category.</p>}
      </div>

      {/* DEVICE HISTORY MODAL */}
      {historyDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Repair History: {historyDevice.deviceName}</h2>
            <div className="space-y-4">
              {requestsList.filter(r => r.deviceId === historyDevice.id).map(h => (
                <div key={h.id} className="border-b pb-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>{h.createdAt}</span>
                    <span className={h.status === "Completed" ? "text-green-600" : "text-gray-600"}>{h.status}</span>
                  </div>
                  <p className="text-sm text-gray-700">{h.issue}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setHistoryDevice(null)} className="mt-4 w-full py-2 bg-gray-200 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}