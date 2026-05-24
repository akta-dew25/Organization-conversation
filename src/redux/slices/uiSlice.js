import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modals: {
    createChannel: false,
    addMembers: false,
    userProfile: false,
    settings: false,
  },
  sidebarOpen: true,
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload,
      );
    },
  },
});

export const {
  openModal,
  closeModal,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
