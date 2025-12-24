import { createSlice } from "@reduxjs/toolkit";

const sampleData = [
  {
    id: 1,
    deviceId: 1, // references device id
    requestedById: 3, // references user id
    assignedToId: 2, // technician id
    issue: "Screen not turning on",
    department: "IT",
    status: "Pending",
    priority: "High",
    problemCategory: "Hardware",
    detailedDescription: "The screen flickers and then turns off after 5 minutes of use.",
    problemStartDate: "2025-11-30",
    previousRepairHistory: "No",
    address: "Building A, Room 302",
    serviceType: "Repair",
    images: [],
    partsUsed: [],
    repairStage: "Diagnosing",
    deadline: "2025-12-10",
    adminInstructions: "Check power supply unit first.",
    accepted: true,
    isPaused: false,
    comments: [{ id: 1, user: "Admin", text: "Please prioritize this.", date: "2025-12-01 10:00" }],
    createdAt: "2025-12-01",
    lastUpdated: "2025-12-01",
    notes: "Urgent",
    isDeleted: false,
  },
  {
    id: 2,
    deviceId: 2,
    requestedById: 4,
    assignedToId: 5,
    issue: "Printer paper jam",
    department: "Admin",
    status: "In Progress",
    priority: "Medium",
    problemCategory: "Hardware",
    detailedDescription: "Paper gets stuck in the tray repeatedly.",
    problemStartDate: "2025-12-04",
    previousRepairHistory: "Yes",
    address: "Admin Block, 1st Floor",
    serviceType: "Maintenance",
    images: [],
    partsUsed: [],
    repairStage: "Waiting for parts",
    deadline: "2025-12-12",
    adminInstructions: "",
    accepted: true,
    isPaused: true,
    comments: [],
    createdAt: "2025-12-05",
    lastUpdated: "2025-12-06",
    notes: "",
    isDeleted: false,
  },
];

const initialState = {
  list: sampleData,
};

const repairRequestsSlice = createSlice({
  name: "repairRequests",
  initialState,
  reducers: {
    addRequest: (state, action) => {
      state.list.push(action.payload);
    },
    updateRequest: (state, action) => {
      const index = state.list.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    loadSampleData: (state) => {
      state.list = sampleData;
    },
  },
});

export const { addRequest, updateRequest, loadSampleData } = repairRequestsSlice.actions;
export default repairRequestsSlice.reducer;
