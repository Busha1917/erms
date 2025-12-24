import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addRequest } from "../../store/repairRequestsSlice";
import { addNotification } from "../../store/notificationsSlice";
import { loadSampleData as loadInventory } from "../../store/inventorySlice";
import { loadSampleData as loadDevices } from "../../store/devicesSlice";
import { loadSampleData as loadUsers } from "../../store/usersSlice";

export default function AdminNewRequest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const devicesList = useSelector((state) => state.devices?.list);
  const devices = Array.isArray(devicesList) ? devicesList : [];
  const usersList = useSelector((state) => state.users?.list);
  const users = Array.isArray(usersList) ? usersList : [];
  const inventoryList = useSelector((state) => state.inventory?.list || []);

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
  };

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (inventoryList.length === 0) dispatch(loadInventory());
    if (devices.length === 0) dispatch(loadDevices());
    if (users.length === 0) dispatch(loadUsers());
  }, [dispatch, inventoryList.length, devices.length, users.length]);

  const handleUserChange = (e) => {
    const userId = Number(e.target.value);
    const selectedUser = users.find(u => u.id === userId);
    setForm(prev => ({
      ...prev,
      requestedById: userId,
      department: selectedUser?.department || prev.department,
      address: selectedUser?.address || prev.address
    }));
  };

  const handleSave = () => {
    dispatch(addRequest({
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
      lastUpdated: "-",
      isDeleted: false
    }));

    // Notify Technician if assigned immediately
    if (form.assignedToId) {
      dispatch(addNotification({
        targetUserId: Number(form.assignedToId),
        message: `New repair task assigned: ${form.issue}`,
        date: new Date().toLocaleString(),
      }));
    }
    navigate("/admin/requests");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Repair Request</h1>

      <div className="space-y-6">
        
        {/* REQUESTER INFORMATION */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 border-b pb-1">Requester Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Requested By</label>
              <select
                value={form.requestedById}
                onChange={handleUserChange}
                className="w-full border rounded px-2 py-1 mt-1"
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Pickup / Delivery Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border rounded px-2 py-1 mt-1"
                placeholder="Building, Room number..."
              />
            </div>
          </div>
        </div>

        {/* DEVICE & ASSIGNMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Device</label>
            <select
              value={form.deviceId}
              onChange={(e) => setForm({ ...form, deviceId: Number(e.target.value) })}
              className="w-full border rounded px-2 py-1 mt-1"
            >
              <option value="">Select Device</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.deviceName} (SN: {d.serialNumber})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assign To (Technician)</label>
            <select
              value={form.assignedToId}
              onChange={(e) => setForm({ ...form, assignedToId: Number(e.target.value) })}
              className="w-full border rounded px-2 py-1 mt-1"
            >
              <option value="">Unassigned</option>
              {users.filter(u => u.role === "technician").map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.specialty || "General"})</option>
              ))}
            </select>
          </div>
        </div>

        {/* PROBLEM DETAILS */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Problem Description</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
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
              <label className="block text-sm font-medium">Priority</label>
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
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Issue Summary</label>
            <input
              type="text"
              value={form.issue}
              onChange={(e) => setForm({ ...form, issue: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
              placeholder="Brief summary..."
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Detailed Description</label>
            <textarea
              value={form.detailedDescription}
              onChange={(e) => setForm({ ...form, detailedDescription: e.target.value })}
              className="w-full border rounded px-2 py-1 h-24 mt-1"
              placeholder="Detailed explanation of the problem..."
            />
          </div>
        </div>

        {/* ADMIN INSTRUCTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Admin Instructions</label>
            <input
              type="text"
              value={form.adminInstructions}
              onChange={(e) => setForm({ ...form, adminInstructions: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
              placeholder="Instructions for technician..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <button 
            onClick={() => navigate("/admin/requests")} 
            className="px-4 py-2 rounded border hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Create Request
          </button>
        </div>
      </div>
    </div>
  );
}