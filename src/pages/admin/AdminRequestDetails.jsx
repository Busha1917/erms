import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateRequest, loadSampleData as loadRequests } from "../../store/repairRequestsSlice";
import { addNotification } from "../../store/notificationsSlice";
import { fetchInventory as loadInventory } from "../../store/inventorySlice";
import { loadSampleData as loadDevices } from "../../store/devicesSlice";
import { loadSampleData as loadUsers } from "../../store/usersSlice";

export default function AdminRequestDetails() {
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

  // Load data if missing
  useEffect(() => {
    if (requestsList.length === 0) dispatch(loadRequests());
    if (devicesList.length === 0) dispatch(loadDevices());
    if (usersList.length === 0) dispatch(loadUsers());
    if (inventoryList.length === 0) dispatch(loadInventory());
  }, [dispatch, requestsList.length, devicesList.length, usersList.length, inventoryList.length]);

  // Find and set request data
  useEffect(() => {
    const request = requestsList.find((r) => String(r.id) === String(id) || String(r._id) === String(id));
    if (request) {
      setForm({
        ...request,
        comments: request.comments || [],
        partsUsed: request.partsUsed || [],
      });
    }
  }, [id, requestsList]);

  if (!form) return <div className="p-6">Loading request details...</div>;

  const handleSave = () => {
    const originalRequest = requestsList.find((r) => String(r.id) === String(id));
    
    if (originalRequest) {
      // Notify User on Status Change
      if (originalRequest.status !== form.status) {
        dispatch(addNotification({
          targetUserId: form.requestedById,
          message: `Your repair request #${form.id} status has been updated to ${form.status}.`,
          date: new Date().toLocaleString(),
        }));
      }

      // Notify Technician on Assignment or Priority Change
      if (form.assignedToId && (originalRequest.assignedToId !== form.assignedToId || originalRequest.priority !== form.priority)) {
        dispatch(addNotification({
          targetUserId: form.assignedToId,
          message: `Update on Task #${form.id}: ${originalRequest.assignedToId !== form.assignedToId ? "You have been assigned this task." : "Priority/Details updated."}`,
          date: new Date().toLocaleString(),
        }));
      }
    }

    dispatch(updateRequest({ ...form, lastUpdated: new Date().toISOString().split("T")[0] }));
    navigate("/admin/requests");
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = { id: Date.now(), user: currentUser.name, text: newComment, date: new Date().toLocaleString() };
    setForm((prev) => ({ ...prev, comments: [...prev.comments, comment] }));
    setNewComment("");
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Request Details #{form.id}</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate("/admin/requests")} 
            className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN - MAIN INFO */}
        <div className="md:col-span-2 space-y-6">
          
          {/* ASSIGNMENT & STATUS */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                disabled={true}
                className="w-full border rounded px-2 py-1 mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full border rounded px-2 py-1 mt-1"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assigned Technician</label>
              <select
                value={form.assignedToId}
                onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
                className="w-full border rounded px-2 py-1 mt-1"
              >
                <option value="">Unassigned</option>
                {usersList.filter(u => u.role === "technician").map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </div>
          </div>

          {/* PROBLEM DESCRIPTION */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Problem Description</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Issue Summary</label>
                <input
                  type="text"
                  value={form.issue}
                  onChange={(e) => setForm({ ...form, issue: e.target.value })}
                  className="w-full border rounded px-2 py-1 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Detailed Description</label>
                <textarea
                  value={form.detailedDescription}
                  onChange={(e) => setForm({ ...form, detailedDescription: e.target.value })}
                  className="w-full border rounded px-2 py-1 h-24 mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <select
                    value={form.problemCategory}
                    onChange={(e) => setForm({ ...form, problemCategory: e.target.value })}
                    className="w-full border rounded px-2 py-1 mt-1"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Network">Network</option>
                    <option value="Power">Power</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Service Type</label>
                  <select
                    value={form.serviceType}
                    onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                    className="w-full border rounded px-2 py-1 mt-1"
                  >
                    <option value="Repair">Repair</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inspection">Inspection</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

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

        {/* RIGHT COLUMN - SIDE INFO */}
        <div className="space-y-6">
          
          {/* CUSTOMER INFO */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Customer Info</h3>
            <div className="text-sm space-y-2">
              <p><span className="font-medium">Name:</span> {usersList.find(u => u.id === form.requestedById)?.name}</p>
              <p><span className="font-medium">Dept:</span> {form.department}</p>
              <p><span className="font-medium">Address:</span> {form.address}</p>
            </div>
          </div>

          {/* DEVICE INFO */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Device Info</h3>
            <div className="text-sm space-y-2">
              {(() => {
                const device = devicesList.find(d => d.id === form.deviceId);
                return device ? (
                  <>
                    <p><span className="font-medium">Name:</span> {device.deviceName}</p>
                    <p><span className="font-medium">S/N:</span> {device.serialNumber}</p>
                    <p><span className="font-medium">Status:</span> {device.status}</p>
                  </>
                ) : <p className="text-gray-500">Device not found</p>;
              })()}
            </div>
          </div>

          {/* ADMIN INSTRUCTIONS */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Admin Instructions</h3>
            <textarea
              value={form.adminInstructions}
              onChange={(e) => setForm({ ...form, adminInstructions: e.target.value })}
              className="w-full border rounded px-2 py-1 h-24 text-sm"
              placeholder="Instructions for technician..."
            />
          </div>

          {/* PARTS USED (Read Only) */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Parts Used</h3>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {form.partsUsed.length === 0 && <p className="text-xs text-gray-400 italic">No parts used.</p>}
              {form.partsUsed.map((p, idx) => (
                <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 border rounded">
                  <span>{p.name} x{p.quantity}</span>
                  <span>${(p.price * p.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            {form.partsUsed.length > 0 && (
              <div className="mt-2 pt-2 border-t flex justify-between font-bold text-sm">
                <span>Total:</span>
                <span>${form.partsUsed.reduce((acc, p) => acc + (p.price * p.quantity), 0).toFixed(2)}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}