import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequests, updateRequest } from "../../store/repairRequestsSlice";
import { Link } from "react-router-dom";
import RepairRequestFormModal from "../../components/RepairRequestFormModal";

export default function UserRequests() {
  const dispatch = useDispatch();
  const { list: requests, loading } = useSelector((state) => state.repairRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
      dispatch(updateRequest({ id, status: "Cancelled" }));
    }
  };

  const handleSave = (data) => {
    dispatch(updateRequest(data));
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Repair Requests</h1>
        <Link to="/user/new-request" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + New Request
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">Issue</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date Submitted</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr> :
             requests.length === 0 ? <tr><td colSpan="5" className="p-4 text-center">No requests found.</td></tr> :
             requests.map((req) => (
              <tr key={req.id || req._id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{req.issue}</td>
                <td className="p-4 text-gray-600">{req.problemCategory}</td>
                <td className="p-4">{new Date(req.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    req.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    req.status === 'Cancelled' ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>{req.status}</span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => setSelectedRequest(req)} className="text-blue-600 hover:underline text-sm mr-3">View</button>
                  {req.status === 'Pending' && (
                    <button onClick={() => handleCancel(req.id || req._id)} className="text-red-600 hover:underline text-sm">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RepairRequestFormModal 
        open={!!selectedRequest} 
        request={selectedRequest} 
        onClose={() => setSelectedRequest(null)} 
        onSave={handleSave} 
        isUserView={true} 
      />
    </div>
  );
}