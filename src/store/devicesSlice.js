import { createSlice } from "@reduxjs/toolkit";

const sampleData = [
  {
    id: 1,
    serialNumber: "SN-1001",
    deviceName: "Laptop HP",
    department: "IT",
    status: "Active",
    isDeleted: false,
    createdAt: "2025-01-01",
    lastChecked: "2025-12-01",
    addedBy: "Admin",
  },
  {
    id: 2,
    serialNumber: "SN-1002",
    deviceName: "Printer Canon",
    department: "Admin",
    status: "Active",
    isDeleted: false,
    createdAt: "2025-02-01",
    lastChecked: "2025-12-05",
    addedBy: "Admin",
  },
  ...Array.from({ length: 28 }, (_, i) => ({
    id: i + 3,
    serialNumber: `SN-10${(i + 3).toString().padStart(2, "0")}`,
    deviceName: i % 2 === 0 ? "Desktop Dell" : "Monitor LG",
    department: ["IT", "HR", "Finance", "Admin"][i % 4],
    status: i % 5 === 0 ? "Suspended" : "Active",
    isDeleted: false,
    createdAt: "2025-03-01",
    lastChecked: "2025-12-10",
    addedBy: "Admin",
  })),
];

const initialState = {
  list: sampleData,
};

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    addDevice: (state, action) => {
      state.list.push(action.payload);
    },
    updateDevice: (state, action) => {
      const index = state.list.findIndex(d => d.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    deleteDevice: (state, action) => {
      const index = state.list.findIndex(d => d.id === action.payload.id);
      if (index !== -1) state.list[index].isDeleted = true;
    },
    restoreDevice: (state, action) => {
      const index = state.list.findIndex(d => d.id === action.payload.id);
      if (index !== -1) state.list[index].isDeleted = false;
    },
    toggleDeviceStatus: (state, action) => {
      const index = state.list.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.list[index].status =
          state.list[index].status === "Active" ? "Inactive" : "Active";
      }
    },
    loadSampleData: (state) => {
      state.list = sampleData;
    },
  },
});

export const { addDevice, updateDevice, deleteDevice, restoreDevice, toggleDeviceStatus, loadSampleData } =
  devicesSlice.actions;

export default devicesSlice.reducer;
