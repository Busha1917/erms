import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const fetchInventory = createAsyncThunk("inventory/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/inventory");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const loadSampleData = fetchInventory;

export const addPart = createAsyncThunk("inventory/add", async (partData, { rejectWithValue }) => {
  try {
    const response = await api.post("/inventory", partData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updatePart = createAsyncThunk("inventory/update", async (partData, { rejectWithValue }) => {
  try {
    const response = await api.put(`/inventory/${partData.id}`, partData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deletePart = createAsyncThunk("inventory/delete", async (partId, { rejectWithValue }) => {
  try {
    await api.delete(`/inventory/${partId}`);
    return partId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPart.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updatePart.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deletePart.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  },
});

export default inventorySlice.reducer;