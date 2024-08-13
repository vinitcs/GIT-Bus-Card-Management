import { createSlice } from "@reduxjs/toolkit";

const initialState = { selectedStudent: null };

export const studentDataSlice = createSlice({
  name: "studentData",
  initialState,
  reducers: {
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
  },
});

export const { setSelectedStudent, clearSelectedStudent } =
  studentDataSlice.actions;
export default studentDataSlice.reducer;
