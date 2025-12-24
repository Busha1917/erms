import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateRequest, loadSampleData as loadRequests } from "../../store/repairRequestsSlice";
import { loadSampleData as loadDevices } from "../../store/devicesSlice";
import { loadSampleData as loadUsers } from "../../store/usersSlice";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function RepairRequests() {
  const devicesList = useSelector((state) => state.devices?.list);
  const devices = Array.isArray(devicesList) ? devicesList : [];
  const usersList = useSelector((state) => state.users?.list);
  const users = Array.isArray(usersList) ? usersList : [];
  const requestsList = useSelector((state) => state.repairRequests?.list);
  const requests = Array.isArray(requestsList) ? requestsList : [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirm, setConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ department: "All", status: "All", technicianId: "All", priority: "All" });
  const [sortBy, setSortBy] = useState("createdAt");
  const [showTrash, setShowTrash] = useState(false);
  const pageSize = 10;

  // Load data if empty
  useEffect(() => {
    if (requests.length === 0) dispatch(loadRequests());
    if (devices.length === 0) dispatch(loadDevices());
    if (users.length === 0) dispatch(loadUsers());
  }, [dispatch, requests.length, devices.length, users.length]);

  useEffect(() => setPage(1), [showTrash, filters, sortBy]);

  // Filtered
  const filteredRequests = useMemo(() => {
    return requests
      .filter((r) => (showTrash ? r.isDeleted : !r.isDeleted))
      .filter((r) => (filters.department === "All" ? true : r.department === filters.department))
      .filter((r) => (filters.status === "All" ? true : r.status === filters.status))
      .filter((r) => (filters.technicianId === "All" ? true : r.assignedToId === Number(filters.technicianId)))
      .filter((r) => (filters.priority === "All" ? true : r.priority === filters.priority));
  }, [requests, filters, showTrash]);

  // Sorted
  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      if (sortBy === "createdAt") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === "device") {
        const da = devices.find((d) => d.id === a.deviceId)?.deviceName || "";
        const db = devices.find((d) => d.id === b.deviceId)?.deviceName || "";
        return da.localeCompare(db);
      }
      if (sortBy === "status") return (a.status || "").localeCompare(b.status || "");
      if (sortBy === "priority") {
        const priorityOrder = { "Urgent": 4, "High": 3, "Medium": 2, "Low": 1 };
        const priorityA = priorityOrder[a.priority] || 0;
        const priorityB = priorityOrder[b.priority] || 0;
        return priorityB - priorityA;
      }
      return 0;
    });
  }, [filteredRequests, sortBy, devices]);

  // Pagination
  const paginatedRequests = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedRequests.slice(start, start + pageSize);
  }, [sortedRequests, page]);

  const totalPages = Math.ceil(sortedRequests.length / pageSize);

  // Unique filters
  const departments = ["All", ...new Set(requests.map((r) => r.department))];
  const technicians = ["All", ...users.filter((u) => u.role === "technician").map((u) => u.id)];

  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{showTrash ? "Recycle Bin" : "Repair Requests"}</h1>
        <div className="space-x-3">
          <button
            onClick={() => setShowTrash(!showTrash)}
            className={`px-4 py-2 rounded border ${showTrash ? "bg-gray-600 text-white" : "bg-white text-gray-700"}`}
          >
            {showTrash ? "View Requests" : "Trash"}
          </button>
          {!showTrash && (
            <button onClick={() => navigate("/admin/requests/new")} className="bg-blue-600 text-white px-4 py-2 rounded">
              + Add Request
            </button>
          )}
        </div>
      </div>

      {/* FILTER & SORT */}
      <div className="flex gap-4">
        <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} className="border rounded px-2 py-1">
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="border rounded px-2 py-1">
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select value={filters.technicianId} onChange={(e) => setFilters({ ...filters, technicianId: e.target.value })} className="border rounded px-2 py-1">
          <option value="All">All Technicians</option>
          {users.filter(u => u.role === "technician").map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="border rounded px-2 py-1">
          <option value="All">All Priorities</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-2 py-1">
          <option value="createdAt">Sort by Date Created</option>
          <option value="device">Sort by Device</option>
          <option value="status">Sort by Status</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-4">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="p-4">Device</th>
              <th className="p-4">Requested By</th>
              <th className="p-4">Assigned To</th>
              <th className="p-4">Department</th>
              <th className="p-4">Status</th>
              <th className="p-4">Stage</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Notes</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedRequests.length === 0 && (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">No repair requests found.</td>
              </tr>
            )}
            {paginatedRequests.map((r) => {
              const device = devices.find((d) => d.id === r.deviceId) || {};
              const requestedBy = users.find((u) => u.id === r.requestedById) || {};
              const assignedTo = users.find((u) => u.id === r.assignedToId) || {};
              return (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">{device.deviceName || "-"}</td>
                  <td className="p-4">{requestedBy.name || "-"}</td>
                  <td className="p-4">{assignedTo.name || "-"}</td>
                  <td className="p-4">{r.department}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "Pending" ? "bg-yellow-100 text-yellow-700" : r.status === "In Progress" ? "bg-blue-100 text-blue-700" : r.status === "Completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{r.repairStage || "-"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.priority === "Urgent" ? "bg-red-500 text-white" :
                      r.priority === "High" ? "bg-red-100 text-red-700" :
                      r.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="p-4">{r.notes}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {!showTrash ? (
                        <>
                          <button onClick={() => navigate(`/admin/requests/${r.id}`)} className="p-1 text-green-600 hover:bg-green-50 rounded">Assign</button>
                          <button onClick={() => navigate(`/admin/requests/${r.id}`)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">Details</button>
                          <button onClick={() => setConfirm({ type: "delete", request: r })} className="p-1 text-red-600 hover:bg-red-50 rounded">Delete</button>
                        </>
                      ) : (
                        <button onClick={() => setConfirm({ type: "restore", request: r })} className="p-1 text-green-600 hover:bg-green-50 rounded">Restore</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-white border disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white border"}`}>{i + 1}</button>
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
      <ConfirmDialog
        open={!!confirm}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm.type === "delete") {
            dispatch(updateRequest({ ...confirm.request, isDeleted: true, status: "Rejected" }));
          } else if (confirm.type === "restore") {
            dispatch(updateRequest({ ...confirm.request, isDeleted: false }));
          }
          setConfirm(null);
        }}
      />
    </div>
  );
}
