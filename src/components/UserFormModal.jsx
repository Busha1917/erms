import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartments } from '../store/departmentsSlice';

const UserFormModal = ({ isOpen, onClose, onSave, initialData, isProfileView = false }) => {
  // Robustly check if we are editing (must have an ID) or adding
  const isEditMode = !!(initialData && (initialData.id || initialData._id));

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
    department: '',
    phone: '',
    address: ''
  });

  const dispatch = useDispatch();
  const { list: departmentsList } = useSelector((state) => state.departments);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchDepartments());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        id: initialData.id || initialData._id,
        name: initialData.name || '',
        username: initialData.username || '',
        email: initialData.email || '',
        password: '', // Password is typically left blank for edits unless changing
        role: initialData.role || 'user',
        department: initialData.department || '',
        phone: (() => {
          // Extract 9 digits if phone exists
          let p = initialData.phone || '';
          if (p.startsWith('+251')) return p.slice(4);
          if (p.startsWith('0')) return p.slice(1);
          return p;
        })(),
        address: initialData.address || ''
      });
    } else {
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'user',
        department: '',
        phone: '',
        address: ''
      });
    }
  }, [initialData, isOpen, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate username and email from name if adding a new user
      if (name === 'name' && !isEditMode) {
        const slug = value.toLowerCase().replace(/[^a-z0-9]/g, '');
        updated.username = slug;
        updated.email = slug ? `${slug}@example.com` : '';
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name) {
      alert("Name is required.");
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      alert("Please enter a valid email address (must include @).");
      return;
    }

    if (!formData.address || !formData.address.trim()) {
      alert("Office Address is required.");
      return;
    }

    // Phone Validation (9 digits)
    const phoneRegex = /^\d{9}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      alert("Phone number must be exactly 9 digits.");
      return;
    }

    const submissionData = { ...formData };
    submissionData.phone = `+251${formData.phone}`;

    // Default password for new users
    if (!isEditMode) {
      submissionData.password = "12345678";
    }

    onSave(submissionData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {isEditMode && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Password (leave blank to keep)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="user">User</option>
              <option value="technician">Technician</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Department</option>
              {departmentsList.map((dept) => (
                <option key={dept.id || dept._id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                +251
              </span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={9}
                placeholder="911223344"
                className="rounded-none rounded-r-lg shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Office Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;