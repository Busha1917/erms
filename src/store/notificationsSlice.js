import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const fetchNotifications = createAsyncThunk("notifications/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/notifications");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const markAsRead = createAsyncThunk("notifications/markRead", async (id, { rejectWithValue }) => {
  try {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const markAllAsRead = createAsyncThunk("notifications/markAllRead", async (_, { rejectWithValue }) => {
  try {
    await api.put("/notifications");
    return true;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { list: [], loading: false, error: null },
  reducers: {
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.list.findIndex(n => n._id === action.payload._id);
        if (index !== -1) state.list[index].read = true;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.list.forEach(n => n.read = true);
      });
  },
});

export const { addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;