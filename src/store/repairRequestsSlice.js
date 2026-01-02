import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const fetchRequests = createAsyncThunk("repairRequests/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/repairs");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addRequest = createAsyncThunk("repairRequests/add", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/repairs", data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateRequest = createAsyncThunk("repairRequests/update", async (data, { rejectWithValue }) => {
  try {
    const id = data.id || data._id;
    const response = await api.put(`/repairs/${id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Alias for backward compatibility
export const loadSampleData = fetchRequests;

const repairRequestsSlice = createSlice({
  name: "repairRequests",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => { state.loading = true; })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addRequest.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateRequest.fulfilled, (state, action) => {
        const index = state.list.findIndex(r => r._id === action.payload._id || r.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default repairRequestsSlice.reducer;