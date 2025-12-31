import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const fetchDevices = createAsyncThunk("devices/fetchAll", async (includeDeleted = false, { rejectWithValue }) => {
  try {
    const response = await api.get(`/devices${includeDeleted ? '?deleted=true' : ''}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const loadSampleData = fetchDevices;

export const addDevice = createAsyncThunk("devices/add", async (deviceData, { rejectWithValue }) => {
  try {
    const response = await api.post("/devices", deviceData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateDevice = createAsyncThunk("devices/update", async (deviceData, { rejectWithValue }) => {
  try {
    const response = await api.put(`/devices/${deviceData.id}`, deviceData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteDevice = createAsyncThunk("devices/delete", async (deviceData, { rejectWithValue }) => {
  try {
    await api.delete(`/devices/${deviceData.id}`);
    return deviceData.id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const restoreDevice = createAsyncThunk("devices/restore", async (deviceId, { rejectWithValue }) => {
  try {
    await api.put(`/devices/${deviceId}/restore`);
    return deviceId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    // Synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        const index = state.list.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        const index = state.list.findIndex((d) => d.id === action.payload);
        if (index !== -1) {
          state.list[index].isDeleted = true;
          state.list[index].status = 'Retired';
        }
      })
      .addCase(restoreDevice.fulfilled, (state, action) => {
        const index = state.list.findIndex((d) => d.id === action.payload);
        if (index !== -1) {
          state.list[index].isDeleted = false;
          state.list[index].status = 'Active';
        }
      });
  },
});

export const { } = devicesSlice.actions;
export default devicesSlice.reducer;
