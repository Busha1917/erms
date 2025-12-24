export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">Repair Performance</h2>
          <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400">
            [Bar Chart Placeholder: Repairs per Month]
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">Technician Efficiency</h2>
          <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400">
            [Pie Chart Placeholder: Tasks Completed by Tech]
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">Financial Overview</h2>
          <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400">
            [Line Chart Placeholder: Revenue from Parts & Labor]
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">Inventory Usage</h2>
          <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400">
            [Table Placeholder: Most Used Parts]
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Export All Data (CSV)</button>
      </div>
    </div>
  );
}