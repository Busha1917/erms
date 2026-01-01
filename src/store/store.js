import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import devicesReducer from "./devicesSlice";
import repairRequestsReducer from "./repairRequestsSlice";
import authReducer from "./authSlice";
import inventoryReducer from "./inventorySlice";
import notificationsReducer from "./notificationsSlice";
import dashboardReducer from "./dashboardSlice";
import reportsReducer from "./reportsSlice";
import settingsReducer from "./settingsSlice";
import departmentsReducer from "./departmentsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    devices: devicesReducer,
    repairRequests: repairRequestsReducer,
    auth: authReducer,
    inventory: inventoryReducer,
    notifications: notificationsReducer,
    dashboard: dashboardReducer,
    reports: reportsReducer,
    settings: settingsReducer,
    departments: departmentsReducer,
  },
});

export default store;
