import { useEffect, useState, useRef } from "react";

export default function UserFormModal({ open, user, onSave, onClose, isProfileView = false }) {
  const isEdit = Boolean(user?.id);

  const emptyUser = {
    name: "",
    username: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    status: "Active",
    specialty: "",
    avatar: null,
  };

  const [form, setForm] = useState(emptyUser);
  const [touched, setTouched] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({ ...emptyUser, ...user });
    } else {
      setForm(emptyUser);
    }
  }, [user]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      const newForm = { ...prevForm, [name]: value };
      if (name === "name" && !isEdit) {
        newForm.username = value.replace(/\s+/g, "").toLowerCase();
      }
      return newForm;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prevForm) => ({ ...prevForm, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (f) => {
    const errors = {};
    if (!f.name || !f.name.trim()) errors.name = "Required";
    if (!f.username || !f.username.trim()) errors.username = "Required";
    if (!f.email || !f.email.trim()) errors.email = "Required";
    else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(f.email)) errors.email = "Invalid email";
    }
    if (!f.department) errors.department = "Required";
    if (!f.role) errors.role = "Required";
    return errors;
  };

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4">
        <h2 className="text-xl font-bold">
          {isProfileView ? "My Profile" : (isEdit ? "Edit User" : "Add User")}
        </h2>

        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-24 h-24 mb-2">
            {form.avatar ? (
              <img src={form.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-blue-100" />
            ) : (
              <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-blue-300 text-3xl font-bold border-2 border-blue-100">
                {form.name?.charAt(0) || "U"}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 shadow-sm"
              title="Change Photo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} onBlur={handleBlur} disabled={isProfileView} className="border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500" />
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} onBlur={handleBlur} disabled={isProfileView} className="border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500" />
          <input name="email" placeholder="user@aii.et" value={form.email} onChange={handleChange} onBlur={handleBlur} disabled={isProfileView} className="border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} disabled={isProfileView} className="border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500" />

          <select name="department" value={form.department} onChange={handleChange} onBlur={handleBlur} disabled={isProfileView} className="border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500">
            <option value="" disabled>Department</option>
            <option>IT</option>
            <option>Electronics</option>
            <option>Maintenance</option>
            <option>Administration</option>
            <option>Procurement</option>
          </select>

          <select name="role" value={form.role} onChange={handleChange} onBlur={handleBlur} disabled={isProfileView} className="border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500">
            <option value="" disabled>Role</option>
            <option value="admin">Admin</option>
            <option value="technician">Technician</option>
            <option value="user">User</option>
          </select>

          {form.role === "technician" && (
            <div className="col-span-2">
              <input name="specialty" placeholder="Specialty (e.g., Mobile, Laptop, Printers)" value={form.specialty || ""} onChange={handleChange} onBlur={handleBlur} disabled={isProfileView} className="w-full border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500" />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!isValid) return;
              onSave(form);
            }}
            disabled={!isValid}
            className={`px-4 py-2 text-white rounded ${
              isValid ? "bg-blue-600" : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            {isProfileView ? "Update Picture" : (isEdit ? "Save Changes" : "Add User")}
          </button>
        </div>
      </div>
    </div>
  );
}
