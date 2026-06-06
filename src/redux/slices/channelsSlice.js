import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channels: [],
  selectedChannelId: 1,
  loading: false,
  error: null,
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setChannels: (state, action) => {
      state.channels = action.payload;
    },
    addChannel: (state, action) => {
      state.channels.unshift(action.payload);
    },
    deleteChannel: (state, action) => {
      state.channels = state.channels.filter((c) => c.id !== action.payload);
    },
    updateChannel: (state, action) => {
      const index = state.channels.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.channels[index] = action.payload;
      }
    },
    selectChannel: (state, action) => {
      state.selectedChannelId = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChannels,
  addChannel,
  deleteChannel,
  updateChannel,
  selectChannel,
  setLoading,
  setError,
  updateUnreadCount,
} = channelsSlice.actions;

export default channelsSlice.reducer;
