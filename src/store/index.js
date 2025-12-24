import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import repairsReducer from "./repairsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    repairs: repairsReducer,
  },
});
