export default function EditUserModal({
  user,
  onClose,
  onSave,
  departments,
}) {
  const [form, setForm] = useState(user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold">Edit User</h2>

        {["name", "username", "email", "phone"].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
            placeholder={field}
          />
        ))}

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg"
        >
          <option value="admin">Admin</option>
          <option value="technician">Technician</option>
          <option value="user">User</option>
        </select>

        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg"
        >
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
