import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [
    {
      id: 1,
      device: "Laptop",
      issue: "Screen not working",
      status: "pending",
      userId: 3,
      technicianId: null,
    },
  ],
};

const repairsSlice = createSlice({
  name: "repairs",
  initialState,
  reducers: {
    addRepair: (state, action) => {
      state.list.push(action.payload);
    },
    updateRepairStatus: (state, action) => {
      const { id, status } = action.payload;
      const repair = state.list.find((r) => r.id === id);
      if (repair) {
        repair.status = status;
      }
    },
    assignTechnician: (state, action) => {
      const { id, technicianId } = action.payload;
      const repair = state.list.find((r) => r.id === id);
      if (repair) {
        repair.technicianId = technicianId;
        repair.status = "assigned";
      }
    },
  },
});

export const {
  addRepair,
  updateRepairStatus,
  assignTechnician,
} = repairsSlice.actions;

export default repairsSlice.reducer;
