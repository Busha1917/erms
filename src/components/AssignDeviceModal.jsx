import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function AssignDeviceModal({ open, device, onClose, onSave }) {
  const users = useSelector((state) => state.users?.list || []);
  const [assignedToId, setAssignedToId] = useState("");

  useEffect(() => {
    if (device) {
      // Handle populated assignedToId (object) or raw ID (string)
      const currentAssigned = device.assignedToId;
      if (currentAssigned && typeof currentAssigned === 'object') {
        setAssignedToId(currentAssigned.id || currentAssigned._id || "");
      } else {
        setAssignedToId(currentAssigned || "");
      }
    }
  }, [device]);

  const handleSave = () => {
    // Send null if empty string to properly unset in Mongoose
    onSave({ ...device, assignedToId: assignedToId || null });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign Device to User</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Assign To</label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white">Save Assignment</button>
        </div>
      </div>
    </div>
  );
}