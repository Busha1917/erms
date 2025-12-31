import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const fetchSettings = createAsyncThunk("settings/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/settings");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateSettings = createAsyncThunk("settings/update", async (settingsData, { rejectWithValue }) => {
  try {
    const response = await api.put("/settings", settingsData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default settingsSlice.reducer;