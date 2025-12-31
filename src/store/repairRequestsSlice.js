import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const fetchRepairs = createAsyncThunk("repairRequests/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/repairs");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const loadSampleData = fetchRepairs;

export const addRequest = createAsyncThunk("repairRequests/add", async (requestData, { rejectWithValue }) => {
  try {
    const response = await api.post("/repairs", requestData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateRequest = createAsyncThunk("repairRequests/update", async (requestData, { rejectWithValue }) => {
  try {
    const response = await api.put(`/repairs/${requestData.id}`, requestData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const repairRequestsSlice = createSlice({
  name: "repairRequests",
  initialState,
  reducers: {
    // Synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepairs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRepairs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRepairs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addRequest.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateRequest.fulfilled, (state, action) => {
        const index = state.list.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export const { } = repairRequestsSlice.actions;
export default repairRequestsSlice.reducer;
