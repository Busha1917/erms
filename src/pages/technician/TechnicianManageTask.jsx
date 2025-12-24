import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateRequest, loadSampleData as loadRequests } from "../../store/repairRequestsSlice";
import { addNotification } from "../../store/notificationsSlice";
import { loadSampleData as loadInventory } from "../../store/inventorySlice";
import { loadSampleData as loadDevices } from "../../store/devicesSlice";
import { loadSampleData as loadUsers } from "../../store/usersSlice";

export default function TechnicianManageTask() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const requestsList = useSelector((state) => state.repairRequests?.list || []);
  const devicesList = useSelector((state) => state.devices?.list || []);
  const usersList = useSelector((state) => state.users?.list || []);
  const inventoryList = useSelector((state) => state.inventory?.list || []);
  const currentUser = useSelector((state) => state.auth.user);

  const [form, setForm] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");
  const [partQty, setPartQty] = useState(1);

  // Load data if missing
  useEffect(() => {
    if (requestsList.length === 0) dispatch(loadRequests());
    if (devicesList.length === 0) dispatch(loadDevices());
    if (usersList.length === 0) dispatch(loadUsers());
    if (inventoryList.length === 0) dispatch(loadInventory());
  }, [dispatch, requestsList.length, devicesList.length, usersList.length, inventoryList.length]);

  // Find and set request data
  useEffect(() => {
    const request = requestsList.find((r) => r.id === Number(id));
    if (request) {
      setForm({
        ...request,
        comments: request.comments || [],
        partsUsed: request.partsUsed || [],
      });
    }
  }, [id, requestsList]);

  if (!form) return <div className="p-6">Loading task details...</div>;

  const device = devicesList.find((d) => d.id === form.deviceId) || {};
  const requester = usersList.find((u) => u.id === form.requestedById) || {};

  const handleSave = () => {
    const originalRequest = requestsList.find(r => r.id === Number(id));
    if (originalRequest && originalRequest.status !== form.status) {
       dispatch(addNotification({
         targetUserId: form.requestedById,
         message: `Your repair request #${form.id} status is now ${form.status}`,
         date: new Date().toLocaleString()
       }));
    }
    dispatch(updateRequest({ ...form, lastUpdated: new Date().toISOString().split("T")[0] }));
    navigate("/technician/tasks");
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = { id: Date.now(), user: currentUser.name, text: newComment, date: new Date().toLocaleString() };
    setForm((prev) => ({ ...prev, comments: [...prev.comments, comment] }));
    setNewComment("");
  };

  const handleAddPart = () => {
    const part = inventoryList.find((p) => p.id === Number(selectedPartId));
    if (!part) return;
    setForm((prev) => ({
      ...prev,
      partsUsed: [...prev.partsUsed, { id: part.id, name: part.name, quantity: Number(partQty), price: part.price }],
    }));
    setSelectedPartId("");
    setPartQty(1);
  };

  const handleEscalate = () => {
    dispatch(addNotification({
      targetRole: "admin",
      message: `Escalation requested for Task #${form.id} by ${currentUser.name}`,
      date: new Date().toLocaleString(),
    }));
    alert("Escalation request sent to Admin.");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Repair Task #{form.id}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
          form.priority === "Urgent" ? "bg-red-100 text-red-700" :
          form.priority === "High" ? "bg-orange-100 text-orange-700" :
          "bg-blue-100 text-blue-700"
        }`}>
          {form.priority} Priority
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN - DETAILS */}
        <div className="md:col-span-2 space-y-6">
          
          {/* CUSTOMER & DEVICE INFO (Read Only) */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 border-b pb-1">Request Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium text-gray-600">Customer:</span> <span className="text-gray-900">{requester.name}</span></div>
              <div><span className="font-medium text-gray-600">Department:</span> <span className="text-gray-900">{form.department}</span></div>
              <div><span className="font-medium text-gray-600">Phone:</span> <span className="text-gray-900">{requester.phone}</span></div>
              <div><span className="font-medium text-gray-600">Address:</span> <span className="text-gray-900">{form.address || "N/A"}</span></div>
              <div className="col-span-2 mt-2 pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-600">Device:</span> <span className="text-gray-900 font-bold">{device.deviceName}</span> (SN: {device.serialNumber})
              </div>
            </div>
          </div>

          {/* PROBLEM DESCRIPTION (Read Only) */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Problem Description</h3>
            <div className="bg-white border rounded p-3 text-sm space-y-2">
              <p><span className="font-medium">Issue:</span> {form.issue}</p>
              <p><span className="font-medium">Category:</span> {form.problemCategory}</p>
              <p><span className="font-medium">Description:</span> {form.detailedDescription}</p>
            </div>
          </div>

          {/* ADMIN INSTRUCTIONS */}
          {form.adminInstructions && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
              <strong>Admin Instructions:</strong> {form.adminInstructions}
            </div>
          )}

          {/* COMMENTS SECTION */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Comments & Updates</h3>
            <div className="bg-gray-50 p-3 rounded h-48 overflow-y-auto mb-2 space-y-3 border">
              {form.comments.length === 0 && <p className="text-gray-400 text-sm italic">No comments yet.</p>}
              {form.comments.map((c) => (
                <div key={c.id} className="text-sm bg-white p-2 rounded shadow-sm">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className="font-bold text-blue-600">{c.user}</span>
                    <span>{c.date}</span>
                  </div>
                  <p className="text-gray-800">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} 
                className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Add a comment or update..." 
              />
              <button onClick={handleAddComment} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Post</button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - ACTIONS */}
        <div className="space-y-6">
          
          {/* REPAIR PROGRESS */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-bold text-blue-800 uppercase mb-3 border-b border-blue-200 pb-1">Repair Progress</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">Current Stage</label>
                <select
                  value={form.repairStage}
                  onChange={(e) => setForm({ ...form, repairStage: e.target.value })}
                  className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                >
                  <option value="Diagnosing">Diagnosing</option>
                  <option value="Waiting for parts">Waiting for parts</option>
                  <option value="Repair in progress">Repair in progress</option>
                  <option value="Testing">Testing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <button
                onClick={() => setForm({ ...form, isPaused: !form.isPaused })}
                className={`w-full py-2 rounded font-medium text-sm transition ${form.isPaused ? "bg-green-600 hover:bg-green-700 text-white" : "bg-yellow-500 hover:bg-yellow-600 text-white"}`}
              >
                {form.isPaused ? "Resume Repair" : "Pause Repair"}
              </button>

              <div className="pt-2 border-t border-blue-200 flex flex-col gap-2">
                <button 
                  onClick={() => setForm({ ...form, status: "Completed", repairStage: "Completed" })} 
                  className="w-full bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700 font-medium"
                >
                  Mark as Completed
                </button>
                <button 
                  onClick={handleEscalate} 
                  className="w-full bg-red-100 text-red-700 border border-red-200 py-2 rounded text-sm hover:bg-red-200"
                >
                  Request Escalation
                </button>
              </div>
            </div>
          </div>

          {/* SPARE PARTS */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Spare Parts Usage</h3>
            
            <div className="space-y-2 mb-3">
              <select 
                value={selectedPartId} 
                onChange={(e) => setSelectedPartId(e.target.value)} 
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="">Select Part</option>
                {inventoryList.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
              </select>
              
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={partQty} 
                  onChange={(e) => setPartQty(e.target.value)} 
                  className="w-20 border rounded px-2 py-1 text-sm" 
                  min="1" 
                />
                <button onClick={handleAddPart} className="flex-1 bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900">Add Part</button>
              </div>
            </div>

            <div className="space-y-1 max-h-40 overflow-y-auto">
              {form.partsUsed.length === 0 && <p className="text-xs text-gray-400 italic text-center">No parts used yet.</p>}
              {form.partsUsed.map((p, idx) => (
                <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 border rounded">
                  <span>{p.name} <span className="text-gray-500 text-xs">x{p.quantity}</span></span>
                  <span className="font-medium">${(p.price * p.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            {form.partsUsed.length > 0 && (
              <div className="mt-2 pt-2 border-t flex justify-between font-bold text-sm">
                <span>Total Cost:</span>
                <span>${form.partsUsed.reduce((acc, p) => acc + (p.price * p.quantity), 0).toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* SAVE ACTIONS */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handleSave}
              className="w-full py-3 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md"
            >
              Save Changes
            </button>
            <button 
              onClick={() => navigate("/technician/tasks")} 
              className="w-full py-2 rounded border text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}