import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addRequest } from "../../store/repairRequestsSlice";
import { addNotification } from "../../store/notificationsSlice";
import { loadSampleData as loadInventory } from "../../store/inventorySlice";
import { loadSampleData as loadDevices } from "../../store/devicesSlice";

export default function UserNewRequest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
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
    if (inventoryList.length === 0) dispatch(loadInventory());
    if (devices.length === 0) dispatch(loadDevices());
  }, [dispatch, inventoryList.length, devices.length]);

  useEffect(() => {
    if (currentUser) {
      setForm({
        ...defaultForm,
        requestedById: currentUser.id,
        department: currentUser.department || "",
        problemCategory: "Hardware",
        detailedDescription: "",
        problemStartDate: "",
        previousRepairHistory: "No",
        address: currentUser.address || "",
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
  }, [currentUser]);

  // Filter devices for user view
  const availableDevices = devices.filter(d => d.assignedToId === currentUser?.id);

  const handleSave = () => {
    dispatch(addRequest({
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
      lastUpdated: "-",
      isDeleted: false
    }));
    dispatch(addNotification({
      targetRole: ["admin", "technician"],
      message: `New repair request from ${currentUser.name}`,
      date: new Date().toLocaleString()
    }));
    navigate("/user/requests");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Submit New Repair Request</h1>

      <div className="space-y-6">
        
        {/* CUSTOMER INFORMATION */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 border-b pb-1">Customer Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium text-gray-600">Customer ID:</span> <span className="text-gray-900">{currentUser?.id || "-"}</span></div>
            <div><span className="font-medium text-gray-600">Full Name:</span> <span className="text-gray-900">{currentUser?.name || "-"}</span></div>
            <div><span className="font-medium text-gray-600">Phone:</span> <span className="text-gray-900">{currentUser?.phone || "-"}</span></div>
            <div><span className="font-medium text-gray-600">Department:</span> <span className="text-gray-900">{form.department || "-"}</span></div>
          </div>
          
          {/* ADDRESS FIELD */}
          <div className="mt-3 pt-2 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup / Delivery Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Enter building, room number, or location..."
              rows="2"
            />
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

        {/* PROBLEM DESCRIPTION */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Problem Description</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium">Service Type</label>
              <select
                value={form.serviceType}
                onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
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
                className="w-full border rounded px-2 py-1"
                placeholder="Brief summary of the issue"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Detailed Problem Description</label>
              <textarea
                value={form.detailedDescription}
                onChange={(e) => setForm({ ...form, detailedDescription: e.target.value })}
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
                className="w-full border rounded px-2 py-1 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              />
            </div>
          </div>

          {/* TERMS & CONSENT */}
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" checked={form.termsAccepted} onChange={(e) => setForm({ ...form, termsAccepted: e.target.checked })} />
            <span className="text-sm text-gray-600">I agree to the terms and conditions of service.</span>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <button onClick={() => navigate("/user/requests")} className="px-4 py-2 rounded border hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!form.termsAccepted}
              className={`px-4 py-2 rounded text-white ${!form.termsAccepted ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    );
  }
