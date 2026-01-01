import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments, addDepartment, updateDepartment, deleteDepartment } from "../../store/departmentsSlice";
import DepartmentFormModal from "../../components/DepartmentFormModal";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function Departments() {
  const dispatch = useDispatch();
  const { list: departments, loading } = useSelector((state) => state.departments);
  const [selectedDept, setSelectedDept] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleSave = (data) => {
    if (data.id) {
      dispatch(updateDepartment(data));
    } else {
      dispatch(addDepartment(data));
    }
    setIsModalOpen(false);
    setSelectedDept(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
        <button 
          onClick={() => { setSelectedDept(null); setIsModalOpen(true); }} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Department
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4">Manager</th>
              <th className="p-4">Location</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr> : 
             departments.length === 0 ? <tr><td colSpan="5" className="p-4 text-center">No departments found.</td></tr> :
             departments.map((dept) => (
              <tr key={dept._id || dept.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{dept.name}</td>
                <td className="p-4 text-gray-600">{dept.description}</td>
                <td className="p-4">{dept.manager || "-"}</td>
                <td className="p-4">{dept.location || "-"}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => { setSelectedDept(dept); setIsModalOpen(true); }} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => setConfirm(dept)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DepartmentFormModal 
        open={isModalOpen} 
        department={selectedDept} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
      />
      <ConfirmDialog 
        open={!!confirm} 
        title="Delete Department" 
        message={`Are you sure you want to delete ${confirm?.name}?`} 
        onCancel={() => setConfirm(null)} 
        onConfirm={() => { dispatch(deleteDepartment(confirm._id || confirm.id)); setConfirm(null); }} 
      />
    </div>
  );
}