import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import RepairRequestFormModal from "../../components/RepairRequestFormModal";

export default function UserNewRequest() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);

  const handleSave = async (formData) => {
    try {
      setError(null);
      
      // Get token securely with fallbacks
      let authToken = token;
      if (!authToken || authToken === "null" || authToken === "undefined") {
        authToken = localStorage.getItem("token");
      }
      
      // Fallback: sometimes token is inside a user object in localStorage
      if (!authToken || authToken === "null" || authToken === "undefined") {
         const savedUser = localStorage.getItem("user");
         if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                if (parsed.token) authToken = parsed.token;
            } catch (e) {}
         }
      }

      if (!authToken) {
        throw new Error("Authentication missing. Please log in again.");
      }

      // Validation
      if (!formData.deviceId) throw new Error("Please select a device.");
      if (!formData.issue) throw new Error("Please enter a problem summary.");
      if (!formData.termsAccepted && !formData.id) throw new Error("You must accept the terms.");

      // 1. Clean the payload
      // Remove ID if it's a new request to let backend generate it
      // Remove empty strings for fields that might be ObjectIds (like assignedToId)
      const payload = { ...formData };
      
      // Aggressively remove any empty strings, nulls, or undefined values
      Object.keys(payload).forEach(key => {
        if (payload[key] === "" || payload[key] === null || payload[key] === undefined) {
          delete payload[key];
        }
      });

      // 2. Send Request
      // Updated endpoint to match your server logs (/api/repairs)
      const response = await fetch("/api/repairs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      // 3. Handle HTTP Errors
      if (!response.ok) {
        // Check if response is JSON (backend error) or HTML (404/Proxy error)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          throw new Error(errData.message || "Server rejected the request.");
        } else {
          // Handle 500 errors that return HTML or text
          const text = await response.text();
          throw new Error(`Server Error (${response.status}): ${text.substring(0, 100)}...`);
        }
      }

      // 4. Success
      alert("Repair request submitted successfully!");
      navigate("/user/requests");
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
      alert(`Error: ${err.message}`); // Force error visibility over the modal
    }
  };

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error: </strong> {error}
        </div>
      )}
      <RepairRequestFormModal 
        open={true} 
        onClose={() => navigate("/user/dashboard")} 
        onSave={handleSave}
        isUserView={true}
      />
    </div>
  );
}