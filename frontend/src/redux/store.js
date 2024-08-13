import { configureStore } from "@reduxjs/toolkit";
import studentReducer from "./features/studentSlice.js";
import adminReducer from "./features/adminSlice.js";
import studentDataReducer from "./features/studentDataSlice.js";

export const store = configureStore({
  reducer: {
    studentAuth: studentReducer,
    adminAuth: adminReducer,
    studentData: studentDataReducer,
  },
});
