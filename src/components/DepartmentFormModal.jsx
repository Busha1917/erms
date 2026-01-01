import { useState, useEffect } from "react";

export default function DepartmentFormModal({ open, department, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", description: "", manager: "", location: "" });

  useEffect(() => {
    if (department) {
      setForm({
        name: department.name || "",
        description: department.description || "",
        manager: department.manager || "",
        location: department.location || "",
        id: department._id || department.id
      });
    } else {
      setForm({ name: "", description: "", manager: "", location: "" });
    }
  }, [department, open]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{department ? "Edit Department" : "Add Department"}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Department Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Manager / Head</label>
            <input type="text" name="manager" value={form.manager} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
          <button 
            onClick={() => {
              if (!form.name) return alert("Department Name is required");
              onSave(form);
            }} 
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}