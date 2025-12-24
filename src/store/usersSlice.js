import { createSlice } from "@reduxjs/toolkit";

const sampleUsers = [
  { id: 1, name: "Admin User", avatar: null, username: "admin", email: "admin@example.com", password: "123", phone: "555-0100", role: "admin", department: "IT", address: "Server Room 1", status: "Active", createdAt: "2025-01-01", lastLogin: "2025-12-23", createdBy: "System" },
  { id: 2, name: "Tech Sarah", avatar: null, username: "sarah", email: "sarah@example.com", password: "123", phone: "555-0101", role: "technician", specialty: "Laptops", department: "IT", address: "Tech Lab A", status: "Active", createdAt: "2025-01-02", lastLogin: "2025-12-22", createdBy: "Admin" },
  { id: 3, name: "John Doe", avatar: null, username: "jdoe", email: "john@example.com", password: "123", phone: "555-0102", role: "employee", department: "HR", address: "HR Office 101", status: "Active", createdAt: "2025-01-03", lastLogin: "2025-12-20", createdBy: "Admin" },
  { id: 4, name: "Jane Smith", avatar: null, username: "jsmith", email: "jane@example.com", password: "123", phone: "555-0103", role: "employee", department: "Finance", address: "Finance Block B", status: "Active", createdAt: "2025-01-04", lastLogin: "2025-12-21", createdBy: "Admin" },
  { id: 5, name: "Tech Mike", avatar: null, username: "mike", email: "mike@example.com", password: "123", phone: "555-0104", role: "technician", specialty: "Printers", department: "IT", address: "Tech Lab B", status: "Active", createdAt: "2025-01-05", lastLogin: "2025-12-19", createdBy: "Admin" },
  ...Array.from({ length: 35 }, (_, i) => ({
    id: i + 6,
    name: `User ${i + 6}`,
    avatar: null,
    username: `user${i + 6}`,
    email: `user${i + 6}@example.com`,
    password: "123",
    phone: `555-01${(i + 6).toString().padStart(2, "0")}`,
    role: ["employee", "technician", "admin"][i % 3],
    department: ["IT", "HR", "Finance", "Admin", "Sales"][i % 5],
    address: `Building ${String.fromCharCode(65 + (i % 3))}, Room ${100 + i}`,
    status: i % 10 === 0 ? "Suspended" : "Active",
    createdAt: "2025-02-01",
    lastLogin: "2025-12-15",
    createdBy: "Admin",
  })),
];

const initialState = {
  list: sampleUsers,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.list.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.list.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    loadSampleData: (state) => {
      state.list = sampleUsers;
    },
  },
});

export const { addUser, updateUser, loadSampleData } = usersSlice.actions;
export default usersSlice.reducer;