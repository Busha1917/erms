import { createSlice } from "@reduxjs/toolkit";

const loadNotifications = () => {
  try {
    const serializedState = localStorage.getItem("notifications");
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

const initialState = {
  list: loadNotifications(),
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      // payload: { targetRole, targetUserId, message, date, type }
      state.list.unshift({ ...action.payload, id: Date.now(), read: false });
      localStorage.setItem("notifications", JSON.stringify(state.list));
    },
    markAsRead: (state, action) => {
      const notif = state.list.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
      localStorage.setItem("notifications", JSON.stringify(state.list));
    },
    markAllAsRead: (state, action) => {
      const ids = action.payload; // Array of notification IDs
      state.list.forEach((n) => {
        if (ids.includes(n.id)) n.read = true;
      });
      localStorage.setItem("notifications", JSON.stringify(state.list));
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;