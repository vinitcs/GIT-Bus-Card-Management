import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  loading: true,
  isAdminLoggedIn: false,
};

export const adminSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminExist: (state, action) => {
      (state.loading = false),
        (state.isAdminLoggedIn = true),
        (state.admin = action.payload);
    },

    adminNotExist: (state) => {
      (state.loading = false),
        (state.isAdminLoggedIn = false),
        (state.admin = null);
    },

    adminLogout: (state) => {
      (state.isAdminLoggedIn = false), (state.admin = null);
    },
  },
});

export const {
  adminExist,
  adminNotExist,
  adminLogout,
} = adminSlice.actions;
export default adminSlice.reducer;
