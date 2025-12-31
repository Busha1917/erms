import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadSampleData as loadInventory } from "../store/inventorySlice";

export default function RepairRequestFormModal({ open, request, onClose, onSave, isUserView = false, isTechnicianView = false }) {
  const dispatch = useDispatch();
  const usersList = useSelector((state) => state.users?.list);
  const users = Array.isArray(usersList) ? usersList : [];
  const devicesList = useSelector((state) => state.devices?.list);
  const devices = Array.isArray(devicesList) ? devicesList : [];
  const inventoryList = useSelector((state) => state.inventory?.list || []);
  const currentUser = useSelector((state) => state.auth.user);

  const defaultForm = {
    deviceId: "",
    requestedById: "",
    assignedToId: "",
    issue: "",
    department: "",
    status: "Pending",
    priority: "Medium",
    notes: "",
    problemCategory: "Hardware",
    detailedDescription: "",
    problemStartDate: "",
    previousRepairHistory: "No",
    address: "",
    serviceType: "Repair",
    images: [],
    partsUsed: [],
    repairStage: "Diagnosing",
    deadline: "",
    adminInstructions: "",
    comments: [],
    isPaused: false,
    termsAccepted: false,
  };

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (request) {
      setForm({
        ...defaultForm,
        ...request,
        problemCategory: request.problemCategory || "Hardware",
        detailedDescription: request.detailedDescription || "",
        problemStartDate: request.problemStartDate || "",
        previousRepairHistory: request.previousRepairHistory || "No",
        serviceType: request.serviceType || "Repair",
        images: request.images || [],
        partsUsed: request.partsUsed || [],
        repairStage: request.repairStage || "Diagnosing",
        deadline: request.deadline || "",
        adminInstructions: request.adminInstructions || "",
        comments: request.comments || [],
        isPaused: request.isPaused || false,
      });
    } else if (isUserView && currentUser) {
      setForm({
        ...defaultForm,
        requestedById: currentUser.id,
        department: currentUser.department || "",
        problemCategory: "Hardware",
        detailedDescription: "",
        problemStartDate: "",
        previousRepairHistory: "No",
        serviceType: "Repair",
        images: [],
        partsUsed: [],
        repairStage: "Diagnosing",
        deadline: "",
        adminInstructions: "",
        comments: [],
        isPaused: false,
      });
    }
  }, [request, isUserView, currentUser, open]);

  if (!open) return null;

  // Filter devices for user view (Technicians see all or just the one in the request)
  const availableDevices = isUserView
    ? devices.filter(d => d.assignedToId === currentUser?.id && d.status !== "Suspended")
    : devices;

  // Get details of the requested user (either current user or selected user)
  const requestUser = isUserView
    ? currentUser 
    : users.find(u => u.id === form.requestedById);

  const handleUserChange = (e) => {
    const userId = Number(e.target.value);
    const selectedUser = users.find(u => u.id === userId);
    setForm(prev => ({
      ...prev,
      requestedById: userId,
      department: selectedUser?.department || prev.department
    }));
  };

  const [newComment, setNewComment] = useState("");
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = { id: Date.now(), user: currentUser.name, text: newComment, date: new Date().toLocaleString() };
    setForm(prev => ({ ...prev, comments: [...prev.comments, comment] }));
    setNewComment("");
  };

  const [selectedPartId, setSelectedPartId] = useState("");
  const [partQty, setPartQty] = useState(1);

  const handleAddPart = () => {
    const part = inventoryList.find(p => p.id === Number(selectedPartId));
    if (!part) return;
    setForm(prev => ({ ...prev, partsUsed: [...prev.partsUsed, { id: part.id, name: part.name, quantity: Number(partQty), price: part.price }] }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {request?.id ? "Edit Repair Request" : "Add Repair Request"}
        </h2>

        <div className="space-y-6">
          
          {/* CUSTOMER INFORMATION */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 border-b pb-1">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium text-gray-600">Customer ID:</span> <span className="text-gray-900">{requestUser?.id || "-"}</span></div>
              <div><span className="font-medium text-gray-600">Full Name:</span> <span className="text-gray-900">{requestUser?.name || "-"}</span></div>
              <div><span className="font-medium text-gray-600">Phone:</span> <span className="text-gray-900">{requestUser?.phone || "-"}</span></div>
              <div><span className="font-medium text-gray-600">Department:</span> <span className="text-gray-900">{form.department || "-"}</span></div>
            </div>
            
            {/* ADDRESS FIELD */}
            <div className="mt-3 pt-2 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup / Delivery Address</label>
              {isUserView && !request?.id ? (
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Enter building, room number, or location..."
                  rows="2"
                />
              ) : (
                <div className="text-sm text-gray-900 bg-white p-2 border rounded">
                  {form.address || <span className="text-gray-400 italic">No address provided</span>}
                </div>
              )}
            </div>
          </div>

          {/* DEVICE INFORMATION */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Device Information</h3>
          <div>
            <label className="block text-sm font-medium">Device</label>
            <select
              value={form.deviceId}
              onChange={(e) => setForm({ ...form, deviceId: Number(e.target.value) })}
              disabled={isTechnicianView}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select Device</option>
              {availableDevices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.deviceName} (SN: {d.serialNumber})
                </option>
              ))}
            </select>
          </div>
          </div>

          {!isUserView && !isTechnicianView && (
          <div>
            <label className="block text-sm font-medium">Requested By</label>
            <select
              value={form.requestedById}
              onChange={handleUserChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          )}

          {!isUserView && !isTechnicianView && (
          <div>
            <label className="block text-sm font-medium">Assign To (Technician)</label>
            <select
              value={form.assignedToId}
              onChange={(e) => setForm({ ...form, assignedToId: Number(e.target.value) })}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select Technician</option>
              {users
                .filter((u) => u.role === "technician")
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.email})
                  </option>
                ))}
            </select>
          </div>
          )}

          {/* TECHNICIAN / ADMIN INSTRUCTIONS & DEADLINE */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  disabled={isUserView || isTechnicianView}
                  className="w-full border rounded px-2 py-1 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Admin Instructions</label>
                <input
                  type="text"
                  value={form.adminInstructions}
                  onChange={(e) => setForm({ ...form, adminInstructions: e.target.value })}
                  disabled={isUserView || isTechnicianView}
                  className="w-full border rounded px-2 py-1 disabled:bg-gray-100"
                  placeholder="Instructions for technician..."
                />
              </div>
            </div>

          {/* REPAIR PROGRESS MANAGEMENT */}
            <div className={`p-4 rounded-lg border mb-3 ${isTechnicianView ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-sm font-bold uppercase mb-3 border-b pb-1 ${isTechnicianView ? 'text-blue-800 border-blue-200' : 'text-gray-700 border-gray-200'}`}>Repair Progress</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium">Current Stage</label>
                  <select
                    value={form.repairStage}
                    onChange={(e) => setForm({ ...form, repairStage: e.target.value })}
                    disabled={isUserView}
                    className="w-full border rounded px-2 py-1 disabled:bg-gray-100"
                  >
                    <option value="Diagnosing">Diagnosing</option>
                    <option value="Waiting for parts">Waiting for parts</option>
                    <option value="Repair in progress">Repair in progress</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                {isTechnicianView && (
                <div className="flex items-end">
                  <button
                    onClick={() => setForm({ ...form, isPaused: !form.isPaused })}
                    className={`w-full py-1.5 rounded font-medium text-sm ${form.isPaused ? "bg-green-600 text-white" : "bg-yellow-500 text-white"}`}
                  >
                    {form.isPaused ? "Resume Repair" : "Pause Repair"}
                  </button>
                </div>
                )}
              </div>

              {isTechnicianView && (
              <div className="flex gap-2">
                <button onClick={() => setForm({ ...form, status: "Completed", repairStage: "Completed" })} className="flex-1 bg-green-600 text-white py-1 rounded text-sm hover:bg-green-700">Mark as Completed</button>
                <button onClick={() => alert("Escalation request sent to Admin.")} className="flex-1 bg-red-600 text-white py-1 rounded text-sm hover:bg-red-700">Request Escalation</button>
              </div>
              )}
            </div>

          {/* SPARE PARTS USAGE (Technician View) */}
          {isTechnicianView && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Spare Parts Usage</h3>
              <div className="flex gap-2 mb-3">
                <select value={selectedPartId} onChange={(e) => setSelectedPartId(e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm">
                  <option value="">Select Part</option>
                  {inventoryList.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
                </select>
                <input type="number" value={partQty} onChange={(e) => setPartQty(e.target.value)} className="w-20 border rounded px-2 py-1 text-sm" min="1" />
                <button onClick={handleAddPart} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Add</button>
              </div>
              <div className="space-y-1">
                {form.partsUsed.map((p, idx) => (
                  <div key={idx} className="flex justify-between text-sm bg-white p-2 border rounded">
                    <span>{p.name} (x{p.quantity})</span>
                    <span>${(p.price * p.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROBLEM DESCRIPTION */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Problem Description</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium">Service Type</label>
                <select
                  value={form.serviceType}
                  onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                  disabled={isTechnicianView}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="Repair">Repair</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inspection">Inspection</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Problem Category</label>
                <select
                  value={form.problemCategory}
                  onChange={(e) => setForm({ ...form, problemCategory: e.target.value })}
                  disabled={isTechnicianView}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Network">Network</option>
                  <option value="Power">Power</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">When Problem Started</label>
                <input
                  type="date"
                  value={form.problemStartDate}
                  onChange={(e) => setForm({ ...form, problemStartDate: e.target.value })}
                  max={new Date().toISOString().split("T")[0]}
                  disabled={isTechnicianView}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Problem Summary (Title)</label>
              <input
                type="text"
                value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
                disabled={isTechnicianView}
                className="w-full border rounded px-2 py-1"
                placeholder="Brief summary of the issue"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Detailed Problem Description</label>
              <textarea
                value={form.detailedDescription}
                onChange={(e) => setForm({ ...form, detailedDescription: e.target.value })}
                disabled={isTechnicianView}
                className="w-full border rounded px-2 py-1 h-24"
                placeholder="Please describe the issue in detail..."
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium">Previous Repair History?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="previousRepairHistory"
                    value="Yes"
                    checked={form.previousRepairHistory === "Yes"}
                    onChange={(e) => setForm({ ...form, previousRepairHistory: e.target.value })}
                    disabled={isTechnicianView}
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="previousRepairHistory"
                    value="No"
                    checked={form.previousRepairHistory === "No"}
                    onChange={(e) => setForm({ ...form, previousRepairHistory: e.target.value })}
                    disabled={isTechnicianView}
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>

            {/* MEDIA UPLOAD (Placeholder) */}
            <div className="mt-3">
              <label className="block text-sm font-medium">Upload Images/Media</label>
              <input 
                type="file" 
                multiple 
                disabled={isTechnicianView}
                className="w-full border rounded px-2 py-1 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            {isUserView ? (
              <div className="w-full border rounded px-2 py-1 bg-gray-50 text-gray-700 font-medium">
                {form.status}
              </div>
            ) : (
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border rounded px-2 py-1"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            )}
          </div>

          {!isUserView && (
          <div>
            <label className="block text-sm font-medium">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              disabled={isTechnicianView}
              className="w-full border rounded px-2 py-1"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          )}

          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          {/* TERMS & CONSENT (User View) */}
          {isUserView && !request?.id && (
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" checked={form.termsAccepted} onChange={(e) => setForm({ ...form, termsAccepted: e.target.checked })} />
              <span className="text-sm text-gray-600">I agree to the terms and conditions of service.</span>
            </div>
          )}

          {/* COMMENTS & COMMUNICATION */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Comments & Updates</h3>
            <div className="bg-gray-50 p-3 rounded h-32 overflow-y-auto mb-2 space-y-2 border">
              {form.comments.length === 0 && <p className="text-gray-400 text-sm italic">No comments yet.</p>}
              {form.comments.map((c) => (
                <div key={c.id} className="text-sm">
                  <span className="font-bold text-blue-600">{c.user}</span> <span className="text-xs text-gray-500">({c.date})</span>
                  <p className="text-gray-800">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} 
                className="flex-1 border rounded px-2 py-1 text-sm" placeholder="Add a comment or update..." 
              />
              <button onClick={handleAddComment} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Post</button>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 rounded border">
              Cancel
            </button>
            <button
              onClick={() => onSave({ ...form, id: request?.id || Date.now(), lastUpdated: new Date().toISOString().split("T")[0] })}
              disabled={isUserView && !request?.id && !form.termsAccepted}
              className={`px-4 py-2 rounded text-white ${isUserView && !request?.id && !form.termsAccepted ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
