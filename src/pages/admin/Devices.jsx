import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addDevice, updateDevice, loadSampleData as loadDevices } from "../../store/devicesSlice";
import { loadSampleData as loadUsers } from "../../store/usersSlice";
import DeviceFormModal from "../../components/DeviceFormModal";
import AssignDeviceModal from "../../components/AssignDeviceModal";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function Devices() {
  const devicesList = useSelector((state) => state.devices?.list);
  const devices = Array.isArray(devicesList) ? devicesList : [];
  const usersList = useSelector((state) => state.users?.list);
  const users = Array.isArray(usersList) ? usersList : [];
  const dispatch = useDispatch();

  const [assignDevice, setAssignDevice] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const [showTrash, setShowTrash] = useState(false);

  const [filters, setFilters] = useState({ department: "All", status: "All" });
  const [sortBy, setSortBy] = useState("serialNumber");

  const pageSize = 5;

  // Load sample data if list is empty
  useEffect(() => {
    if (devices.length === 0) dispatch(loadDevices());
    if (users.length === 0) dispatch(loadUsers());
  }, [dispatch, devices.length, users.length]);

  // Reset page when switching views
  useEffect(() => setPage(1), [showTrash, filters, sortBy]);

  // Filtering
  const filteredDevices = useMemo(() => {
    return devices
      .filter((d) => (showTrash ? d.isDeleted : !d.isDeleted))
      .filter((d) =>
        filters.department === "All" ? true : d.department === filters.department
      )
      .filter((d) =>
        filters.status === "All" ? true : d.status === filters.status
      );
  }, [devices, showTrash, filters]);

  // Sorting
  const sortedDevices = useMemo(() => {
    return [...filteredDevices].sort((a, b) => {
      if (sortBy === "serialNumber") return (a.serialNumber || "").localeCompare(b.serialNumber || "");
      if (sortBy === "createdAt") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === "department") return (a.department || "").localeCompare(b.department || "");
      return (a.id || 0) - (b.id || 0);
    });
  }, [filteredDevices, sortBy]);

  // Pagination
  const paginatedDevices = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedDevices.slice(start, start + pageSize);
  }, [sortedDevices, page]);

  const totalPages = Math.ceil(sortedDevices.length / pageSize);

  // Add device
  const handleAddDevice = () => {
    setSelectedDevice({
      serialNumber: "",
      deviceName: "",
      department: "",
      status: "Active",
    });
  };

  // Unique departments for filter
  const departments = ["All", ...new Set(devices.map(d => d.department))];

  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{showTrash ? "Recycle Bin" : "Device Management"}</h1>
        <div className="space-x-3">
          <button
            onClick={() => setShowTrash(!showTrash)}
            className={`px-4 py-2 rounded border ${
              showTrash ? "bg-gray-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            {showTrash ? "View Devices" : "Trash"}
          </button>
          {!showTrash && (
            <button
              onClick={handleAddDevice}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Add Device
            </button>
          )}
        </div>
      </div>

      {/* FILTER & SORT */}
      <div className="flex gap-4">
        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          className="border rounded-lg px-2 py-1"
        >
          {departments.map((dep) => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border rounded-lg px-2 py-1"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg px-2 py-1"
        >
          <option value="serialNumber">Sort by Serial Number</option>
          <option value="createdAt">Sort by Date Added</option>
          <option value="department">Sort by Department</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-4">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="p-4">Device Profile</th>
              <th className="p-4">Department</th>
              <th className="p-4">Assigned To</th>
              <th className="p-4">Status</th>
              <th className="p-4">Activity</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedDevices.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                {/* Find assigned user */}
                {(() => { const assignedUser = users.find(u => u.id === d.assignedToId); return (
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center font-medium">
                      {String(d.deviceName || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{d.deviceName}</div>
                      <div className="text-sm text-gray-500">SN: {d.serialNumber}</div>
                    </div>
                  </div>
                </td>
                );})()}
                <td className="p-4">{d.department}</td>
                <td className="p-4">{users.find(u => u.id === d.assignedToId)?.name || <span className="text-gray-400 italic">Unassigned</span>}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      d.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="p-4 text-xs text-gray-500 space-y-1">
                  <div>Added: {d.createdAt || "-"}</div>
                  <div>Last Checked: {d.lastChecked || "-"}</div>
                  <div>By: {d.addedBy || "-"}</div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {!showTrash ? (
                      <>
                        <button
                          onClick={() => setAssignDevice(d)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Assign"
                        >Assign</button>
                        <button
                          onClick={() => setSelectedDevice(d)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          Edit
                        </button>
                        {d.status === "Active" ? (
                          <button
                            onClick={() => setConfirm({ type: "suspend", device: d })}
                            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                            title="Suspend"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirm({ type: "activate", device: d })}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Activate"
                          >
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => setConfirm({ type: "delete", device: d })}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirm({ type: "restore", device: d })}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Restore"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white border"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* MODALS */}
      <AssignDeviceModal
        open={!!assignDevice}
        device={assignDevice}
        onClose={() => setAssignDevice(null)}
        onSave={(formData) => {
          dispatch(updateDevice(formData));
          setAssignDevice(null);
        }}
      />
      <DeviceFormModal
        open={!!selectedDevice}
        device={selectedDevice}
        departments={["IT", "Electronics", "Maintenance", "Administration", "Procurement"]}
        onClose={() => setSelectedDevice(null)}
        onSave={(formData) => {
          if (selectedDevice.id) {
            dispatch(updateDevice(formData));
          } else {
            dispatch(
              addDevice({
                ...formData,
                id: Date.now(),
                createdAt: new Date().toISOString().split("T")[0],
                lastChecked: "-",
                addedBy: "Admin",
                isDeleted: false,
                status: formData.status || "Active",
              })
            );
          }
          setSelectedDevice(null);
        }}
      />

      <ConfirmDialog
        open={!!confirm}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm.type === "delete") {
            dispatch(updateDevice({ ...confirm.device, isDeleted: true, status: "Suspended" }));
          } else if (confirm.type === "restore") {
            dispatch(updateDevice({ ...confirm.device, isDeleted: false }));
          } else if (confirm.type === "suspend") {
            dispatch(updateDevice({ ...confirm.device, status: "Suspended" }));
          } else if (confirm.type === "activate") {
            dispatch(updateDevice({ ...confirm.device, status: "Active" }));
          }
          setConfirm(null);
        }}
      />
    </div>
  );
}
