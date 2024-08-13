import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  student: null,
  loading: true,
  isLoggedIn: false,
};

export const studentSlice = createSlice({
  name: "studentAuth",
  initialState,
  reducers: {
    studentExist: (state, action) => {
      (state.loading = false),
        (state.isLoggedIn = true),
        (state.student = action.payload);
    },
    studentNotExist: (state) => {
      (state.loading = false),
        (state.isLoggedIn = false),
        (state.student = null);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.student = null;
    },

    
  },
});

export const { studentExist, studentNotExist, logout } = studentSlice.actions;

export default studentSlice.reducer;
