import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, addUser, updateUser, deleteUser, restoreUser } from "../../store/usersSlice";
import UserFormModal from "../../components/UserFormModal";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function Users() {
  const { list: usersList, loading, error } = useSelector((state) => state.users);
  const users = Array.isArray(usersList) ? usersList : [];
  const { list: devicesList } = useSelector((state) => state.devices);
  const devices = Array.isArray(devicesList) ? devicesList : [];
  const dispatch = useDispatch();

  /* ---------- UI state ---------- */
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirm, setConfirm] =useState(null);
  const [page, setPage] = useState(1);
  const [showTrash, setShowTrash] = useState(false);
  const [filters, setFilters] = useState({ department: "All", role: "All", status: "All" });
  const [sortBy, setSortBy] = useState("name");
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const pageSize = 5;

  // Reset page when switching views
  useEffect(() => {
    setPage(1);
  }, [showTrash, filters, sortBy, searchQuery]);

  // Load data from backend
  useEffect(() => {
    dispatch(fetchUsers(showTrash));
  }, [dispatch, showTrash]);

  /* ---------- pagination ---------- */
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => showTrash ? u.isDeleted : !u.isDeleted)
      .filter((u) => (filters.department === "All" ? true : u.department === filters.department))
      .filter((u) => (filters.role === "All" ? true : u.role === filters.role))
      .filter((u) => (filters.status === "All" ? true : u.status === filters.status))
      .filter((u) => {
        if (!searchQuery) return true;
        const lowerQuery = searchQuery.toLowerCase();
        return (
          (u.name || "").toLowerCase().includes(lowerQuery) ||
          (u.email || "").toLowerCase().includes(lowerQuery)
        );
      });
  }, [users, filters, searchQuery]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "department") return (a.department || "").localeCompare(b.department || "");
      if (sortBy === "role") return (a.role || "").localeCompare(b.role || "");
      if (sortBy === "createdAt") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      return 0;
    });
  }, [filteredUsers, sortBy]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, page]);

  const totalPages = Math.ceil(sortedUsers.length / pageSize);

  const departments = ["All", ...new Set(users.map((u) => u.department).filter(Boolean))];
  const roles = ["All", ...new Set(users.map((u) => u.role).filter(Boolean))];

  /* ---------- add user ---------- */
  const handleAddUser = () => {
    setSelectedUser({
      name: "",
      username: "",
      email: "",
      password: "", // Add password field for creation
      phone: "",
      department: "",
      role: "",
      status: "Active",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {showTrash ? "Recycle Bin" : "User Management"}
        </h1>
        <div className="space-x-3">
          <button
            onClick={() => setShowTrash(!showTrash)}
            className={`px-4 py-2 rounded border ${
              showTrash ? "bg-gray-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            {showTrash ? "View Users" : "Trash"}
          </button>
          {!showTrash && (
            <button
              onClick={handleAddUser}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Add User
            </button>
          )}
        </div>
      </div>

      {/* FILTER & SORT */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search name or email..."
            className="border rounded px-2 py-1"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            onClick={() => setSearchQuery(searchText)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Search
          </button>
          {searchQuery && (
            <button
              onClick={() => { setSearchText(""); setSearchQuery(""); }}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Clear
            </button>
          )}
        </div>

        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          className="border rounded px-2 py-1"
        >
          {departments.map((d) => (
            <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>
          ))}
        </select>

        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="border rounded px-2 py-1 capitalize"
        >
          {roles.map((r) => (
            <option key={r} value={r}>{r === "All" ? "All Roles" : r}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border rounded px-2 py-1"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-2 py-1">
          <option value="name">Sort by Name</option>
          <option value="department">Sort by Department</option>
          <option value="role">Sort by Role</option>
          <option value="createdAt">Sort by Date Created</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && <div className="p-4 text-center">Loading...</div>}
        {error && <div className="p-4 text-center text-red-500">Error: {error.message || 'Failed to load data'}</div>}
        {!loading && !error && (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="p-4">User Profile</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Role & Dept</th>
                <th className="p-4">Assigned Devices</th>
                <th className="p-4">Status</th>
                <th className="p-4">Activity</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{u.name}</div>
                    <div className="text-sm text-gray-500">@{u.username}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-900">{u.email}</div>
                    <div className="text-sm text-gray-500">{u.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {u.role}
                    </div>
                    <div className="text-sm text-gray-500">{u.department}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-900">
                      {devices.filter(d => d.assignedToId === u.id).map(d => d.deviceName).join(", ") || (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : u.status === "Suspended"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-500 space-y-1">
                    <div>Created: {new Date(u.createdAt).toLocaleDateString() || "-"}</div>
                    <div>Last Login: {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "-"}</div>
                    <div>By: {u.createdBy || "-"}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {!showTrash ? (
                        <>
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          {u.status === "Active" ? (
                            <button
                              onClick={() => setConfirm({ type: "suspend", user: u })}
                              className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                              title="Suspend"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirm({ type: "activate", user: u })}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Activate"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => setConfirm({ type: "delete", user: u })}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirm({ type: "restore", user: u })}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Restore"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 4 1 10 7 10"></polyline>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
      <UserFormModal
        isOpen={!!selectedUser}
        initialData={selectedUser}
        onClose={() => setSelectedUser(null)}
        onSave={(formData) => {
          if (selectedUser.id) {
            dispatch(updateUser(formData));
          } else {
            dispatch(addUser(formData));
          }
          setSelectedUser(null);
        }}
      />

      <ConfirmDialog
        open={!!confirm}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm.type === "delete") {
            dispatch(deleteUser(confirm.user.id));
          } else if (confirm.type === "restore") {
            dispatch(restoreUser(confirm.user.id));
          } else if (confirm.type === "suspend") {
            dispatch(updateUser({ ...confirm.user, status: "Suspended" }));
          } else if (confirm.type === "activate") {
            dispatch(updateUser({ ...confirm.user, status: "Active" }));
          }
          setConfirm(null);
        }}
      />
    </div>
  );
}
