import { useState, useEffect } from "react";

export default function DeviceFormModal({ open, device, onClose, onSave, departments = [] }) {
  const [formData, setFormData] = useState({
    serialNumber: "",
    deviceName: "",
    department: "",
    status: "Active",
    assignedTo: "",
    createdBy: "Admin",
    createdAt: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (device) {
      setFormData({
        serialNumber: "",
        deviceName: "",
        department: "",
        status: "Active",
        assignedTo: "",
        createdBy: "Admin",
        createdAt: new Date().toISOString().split("T")[0],
        ...device,
      });
    }
  }, [device]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    setFormData({
      serialNumber: "",
      deviceName: "",
      department: "",
      status: "Active",
      assignedTo: "",
      createdBy: "Admin",
      createdAt: new Date().toISOString().split("T")[0],
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">{device?.id ? "Edit Device" : "Add New Device"}</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Device Name</label>
            <input
              type="text"
              name="deviceName"
              value={formData.deviceName}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned To</label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="User assigned (optional)"
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {device?.id ? "Update Device" : "Add Device"}
          </button>
        </div>
      </div>
    </div>
  );
}
