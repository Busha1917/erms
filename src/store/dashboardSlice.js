import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const fetchDashboardStats = createAsyncThunk("dashboard/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/dashboard");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { stats: {}, recentActivity: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.recentActivity = action.payload.recentActivity || [];
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;