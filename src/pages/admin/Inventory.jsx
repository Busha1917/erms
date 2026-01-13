import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPart, updatePart, deletePart, fetchInventory } from "../../store/inventorySlice";
import { addNotification } from "../../store/notificationsSlice";
import InventoryFormModal from "../../components/InventoryFormModal";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function Inventory() {
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory?.list || []);
  const currentUser = useSelector((state) => state.auth.user);
  const [selectedPart, setSelectedPart] = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleSave = (formData) => {
    if (selectedPart?.id) {
      dispatch(updatePart(formData));
      if (formData.quantity <= formData.minStock) {
        dispatch(addNotification({
          targetRole: "admin",
          message: `Low Stock Alert: ${formData.name} is below minimum level (${formData.quantity}).`,
          date: new Date().toLocaleString(),
        }));
      }
    } else {
      dispatch(addPart(formData));
    }
    setSelectedPart(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        {currentUser?.role === 'admin' && (
        <button onClick={() => setSelectedPart({})} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Part
        </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">Part Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              {currentUser?.role === 'admin' && <th className="p-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map((part) => (
              <tr key={part.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{part.name}</td>
                <td className="p-4">{part.category}</td>
                <td className="p-4">
                  <span className={part.quantity <= part.minStock ? "text-red-600 font-bold" : ""}>
                    {part.quantity}
                  </span>
                </td>
                <td className="p-4">{part.price.toFixed(2)} ETB</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    part.status === "In Stock" ? "bg-green-100 text-green-700" :
                    part.status === "Low Stock" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {part.status}
                  </span>
                </td>
                {currentUser?.role === 'admin' && (
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setSelectedPart(part)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => setConfirm(part)} className="text-red-600 hover:underline">Delete</button>
                </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InventoryFormModal
        open={!!selectedPart}
        part={selectedPart}
        onClose={() => setSelectedPart(null)}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={!!confirm}
        title="Delete Part"
        message={`Are you sure you want to delete ${confirm?.name}?`}
        onCancel={() => setConfirm(null)}
        onConfirm={() => { dispatch(deletePart(confirm.id || confirm._id)); setConfirm(null); }}
      />
    </div>
  );
}