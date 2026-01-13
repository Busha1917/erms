import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDevices, addDevice, updateDevice, deleteDevice, restoreDevice } from "../../store/devicesSlice";
import { loadSampleData as loadUsers } from "../../store/usersSlice";
import DeviceFormModal from "../../components/DeviceFormModal";
import AssignDeviceModal from "../../components/AssignDeviceModal";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function Devices() {
  const dispatch = useDispatch();
  const { list: devices, loading, error } = useSelector((state) => state.devices);
  const { list: users } = useSelector((state) => state.users);
  
  const [showTrash, setShowTrash] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: "All", status: "All" });
  const [sortBy, setSortBy] = useState("createdAt");
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [assignDevice, setAssignDevice] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchDevices(showTrash));
    if (!users || users.length === 0) dispatch(loadUsers());
  }, [dispatch, showTrash, users?.length]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [showTrash, searchTerm, filters, sortBy]);

  const filteredDevices = useMemo(() => {
    let result = (devices || [])
      .filter((d) => showTrash ? d.isDeleted : !d.isDeleted)
      .filter((d) => 
        d.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.assignedToId?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (filters.type !== "All") {
      result = result.filter((d) => d.type === filters.type);
    }
    if (filters.status !== "All") {
      result = result.filter((d) => d.status === filters.status);
    }

    return result.sort((a, b) => {
      if (sortBy === "deviceName") return a.deviceName.localeCompare(b.deviceName);
      if (sortBy === "serialNumber") return a.serialNumber.localeCompare(b.serialNumber);
      if (sortBy === "type") return a.type.localeCompare(b.type);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      if (sortBy === "createdAt") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });
  }, [devices, showTrash, searchTerm, filters, sortBy]);

  const paginatedDevices = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredDevices.slice(start, start + pageSize);
  }, [filteredDevices, page]);

  const totalPages = Math.ceil(filteredDevices.length / pageSize);

  // Helper to sanitize device data before sending to backend
  const sanitizeDevice = (device) => {
    const payload = { ...device };
    // Ensure ID is present
    payload.id = payload.id || payload._id;
    
    // Flatten assignedToId if it's an object (populated user)
    if (payload.assignedToId && typeof payload.assignedToId === 'object') {
      payload.assignedToId = payload.assignedToId.id || payload.assignedToId._id;
    }
    return payload;
  };

  const handleSaveDevice = (formData) => {
    const payload = sanitizeDevice(formData);
    if (payload.id) {
      dispatch(updateDevice(payload));
    } else {
      dispatch(addDevice(payload));
    }
    setSelectedDevice(null);
  };

  const handleAssignSave = (updatedDevice) => {
    dispatch(updateDevice(sanitizeDevice(updatedDevice)));
    setAssignDevice(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {showTrash ? "Device Recycle Bin" : "Device Management"}
        </h1>
        <div className="space-x-3">
          <button
            onClick={() => setShowTrash(!showTrash)}
            className={`px-4 py-2 rounded border ${showTrash ? "bg-gray-600 text-white" : "bg-white text-gray-700"}`}
          >
            {showTrash ? "View Devices" : "Trash"}
          </button>
          {!showTrash && (
            <button
              onClick={() => setSelectedDevice({})}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              + Add Device
            </button>
          )}
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name, serial number, or owner..."
          className="border rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filters.type}
          onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Types</option>
          <option value="Laptop">Laptop</option>
          <option value="Desktop">Desktop</option>
          <option value="Phone">Phone</option>
          <option value="Tablet">Tablet</option>
          <option value="Printer">Printer</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="In Repair">In Repair</option>
          <option value="Retired">Retired</option>
          <option value="Suspended">Suspended</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-auto"
        >
          <option value="createdAt">Sort by Date Added</option>
          <option value="deviceName">Sort by Name</option>
          <option value="serialNumber">Sort by Serial #</option>
          <option value="type">Sort by Type</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type & Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading devices...</td></tr>
            ) : filteredDevices.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No devices found.</td></tr>
            ) : (
              paginatedDevices.map((device) => (
                <tr key={device.id || device._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{device.deviceName}</div>
                    <div className="text-sm text-gray-500">SN: {device.serialNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {device.brand} {device.model} <br/>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{device.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {device.assignedToId ? (
                      <div>
                        <div className="font-medium">{device.assignedToId.name}</div>
                        <div className="text-xs text-gray-500">{device.assignedToId.email}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      device.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      device.status === 'In Repair' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!showTrash ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setAssignDevice(device)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Assign User">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                        </button>
                        <button onClick={() => setSelectedDevice(device)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setConfirm({ type: 'suspend', device })} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded" title="Suspend">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                        <button onClick={() => setConfirm({ type: 'delete', device })} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirm({ type: 'restore', device })} className="text-green-600 hover:text-green-900 font-medium">Restore</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-white border disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
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
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1 rounded bg-white border disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>

      {/* MODALS */}
      <DeviceFormModal
        open={!!selectedDevice}
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
        onSave={handleSaveDevice}
      />

      <AssignDeviceModal
        open={!!assignDevice}
        device={assignDevice}
        onClose={() => setAssignDevice(null)}
        onSave={handleAssignSave}
      />

      <ConfirmDialog
        open={!!confirm}
        title="Confirm Action"
        message={`Are you sure you want to ${confirm?.type} this device?`}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          // Ensure we have a valid ID (handle _id vs id mismatch if backend wasn't refreshed)
          const deviceId = confirm.device.id || confirm.device._id;
          const payload = sanitizeDevice({ ...confirm.device, id: deviceId });

          if (confirm.type === 'delete') dispatch(deleteDevice({ id: deviceId }));
          if (confirm.type === 'restore') dispatch(restoreDevice(deviceId));
          if (confirm.type === 'suspend') dispatch(updateDevice({ ...payload, status: 'Suspended' }));
          setConfirm(null);
        }}
      />
    </div>
  );
}