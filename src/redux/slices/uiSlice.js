import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modals: {
    createChannel: false,
    addMembers: false,
    userProfile: false,
    settings: false,
    addMember: false,
  },
  modalMeta: {
    createChannel: {},
    addMember: {},
  },
  sidebarOpen: true,
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openModal: (state, action) => {
      if (typeof action.payload === "string") {
        state.modals[action.payload] = true;
        return;
      }

      const { modal, meta } = action.payload;
      if (modal) {
        state.modals[modal] = true;
        state.modalMeta[modal] = {
          ...state.modalMeta[modal],
          ...meta,
        };
      }
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
      if (state.modalMeta[action.payload]) {
        state.modalMeta[action.payload] = {};
      }
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
