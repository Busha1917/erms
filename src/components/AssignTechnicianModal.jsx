import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function AssignTechnicianModal({ open, request, onClose, onSave }) {
  const users = useSelector((state) => state.users?.list || []);
  const [assignedToId, setAssignedToId] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    if (request) {
      setAssignedToId(request.assignedToId || "");
      setPriority(request.priority || "Medium");
    }
  }, [request]);

  const handleSave = () => {
    onSave({ ...request, assignedToId: Number(assignedToId), priority });
  };

  if (!open) return null;

  const technicians = users.filter((u) => u.role === "technician");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign Technician & Set Priority</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Assign To (Technician)</label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
            >
              <option value="">Unassigned</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
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