import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  personals: [],
};

const personalSlice = createSlice({
  name: "personal",
  initialState,
  reducers: {
    setPersonals: (state, action) => {
      state.personals = action.payload;
    },

    addPersonal: (state, action) => {
      state.personals.unshift(action.payload);
    },
  },
});

export const { setPersonals, addPersonal } = personalSlice.actions;

export default personalSlice.reducer;
