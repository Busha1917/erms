export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold mb-2">General Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">System Name</label>
              <input type="text" defaultValue="ERMS" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Support Email</label>
              <input type="email" defaultValue="support@erms.com" className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-bold mb-2">Role & Permissions</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span>Allow Technicians to delete their own notes</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Allow Users to cancel requests after approval</span>
            </label>
          </div>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-bold mb-2">Audit Logs</h2>
          <div className="bg-gray-50 p-4 rounded text-sm text-gray-600 h-32 overflow-y-auto">
            <p>2025-12-24 10:00:00 - Admin updated User #3</p>
            <p>2025-12-24 09:45:12 - Technician #2 completed Request #105</p>
          </div>
        </div>
      </div>
    </div>
  );
}