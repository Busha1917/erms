import { useState, useEffect } from "react";

export default function InventoryFormModal({ open, part, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: 0,
    minStock: 0,
    price: 0,
    status: "In Stock",
  });

  useEffect(() => {
    if (part) {
      setForm(part);
    } else {
      setForm({ name: "", category: "", quantity: 0, minStock: 0, price: 0, status: "In Stock" });
    }
  }, [part, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{part?.id ? "Edit Part" : "Add Spare Part"}</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Part Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input type="text" name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Min Stock Level</label>
              <input type="number" name="minStock" value={form.minStock} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Price (ETB)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-2 py-1">
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
          <button 
            onClick={() => onSave({
              ...form, 
              quantity: Number(form.quantity), 
              minStock: Number(form.minStock),
              price: Number(form.price)
            })} 
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}