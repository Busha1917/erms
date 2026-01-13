import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addRequest } from "../../store/repairRequestsSlice";
import RepairRequestFormModal from "../../components/RepairRequestFormModal";

export default function UserNewRequest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSave = async (formData) => {
    try {
      await dispatch(addRequest(formData)).unwrap();
      navigate("/user/requests");
    } catch (error) {
      console.error("Failed to create request:", error);
    }
  };

  return (
    <RepairRequestFormModal 
      open={true} 
      onClose={() => navigate("/user/dashboard")} 
      onSave={handleSave} 
      isUserView={true} 
    />
  );
}