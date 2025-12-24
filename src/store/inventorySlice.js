import { createSlice } from "@reduxjs/toolkit";

const sampleInventory = [
  { id: 1, name: "LCD Screen 15.6\"", category: "Screen", quantity: 10, minStock: 5, price: 120.00, status: "In Stock" },
  { id: 2, name: "SSD 512GB", category: "Storage", quantity: 3, minStock: 5, price: 60.00, status: "Low Stock" },
  { id: 3, name: "8GB DDR4 RAM", category: "Memory", quantity: 20, minStock: 8, price: 45.00, status: "In Stock" },
  { id: 4, name: "Thermal Paste", category: "Consumable", quantity: 50, minStock: 10, price: 5.00, status: "In Stock" },
  { id: 5, name: "Power Supply Unit 500W", category: "Power", quantity: 0, minStock: 3, price: 55.00, status: "Out of Stock" },
];

const initialState = {
  list: sampleInventory,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addPart: (state, action) => {
      state.list.push(action.payload);
    },
    updatePart: (state, action) => {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    deletePart: (state, action) => {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.list.splice(index, 1);
    },
    loadSampleData: (state) => {
      if (state.list.length === 0) state.list = sampleInventory;
    },
  },
});

export const { addPart, updatePart, deletePart, loadSampleData } = inventorySlice.actions;
export default inventorySlice.reducer;