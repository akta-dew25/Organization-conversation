import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: [],
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    userOnline: (state, action) => {
      const user = action.payload;
      const exists = state.onlineUsers.find(
        (u) =>
          String(u.userId || u.id || u._id) ===
          String(user.userId || user.id || user._id),
      );
      if (!exists) {
        state.onlineUsers.push(user);
      }
    },
    userOffline: (state, action) => {
      const user = action.payload;
      state.onlineUsers = state.onlineUsers.filter(
        (u) =>
          String(u.userId || u.id || u._id) !==
          String(user.userId || user.id || user._id),
      );
    },
  },
});

export const { setOnlineUsers, userOnline, userOffline } =
  presenceSlice.actions;
export default presenceSlice.reducer;
