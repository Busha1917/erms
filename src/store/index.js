import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import devicesReducer from "./devicesSlice";
import repairRequestsReducer from "./repairRequestsSlice";
import authReducer from "./authSlice";
import inventoryReducer from "./inventorySlice";
import notificationsReducer from "./notificationsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    devices: devicesReducer,
    repairRequests: repairRequestsReducer,
    auth: authReducer,
    inventory: inventoryReducer,
    notifications: notificationsReducer,
  },
});

export default store;
