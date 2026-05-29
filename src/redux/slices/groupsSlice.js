import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groups: [],
  selectedGroupId: null,
  loading: false,
  error: null,
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    addGroup: (state, action) => {
      state.groups.unshift(action.payload);
    },
    deleteGroup: (state, action) => {
      state.groups = state.groups.filter((g) => g.id !== action.payload);
    },
    updateGroup: (state, action) => {
      const index = state.groups.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
    },
    selectGroup: (state, action) => {
      state.selectedGroupId = action.payload;
    },
    addMemberToGroup: (state, action) => {
      const { groupId, member } = action.payload;
      const group = state.groups.find((g) => g.id === groupId);
      if (group) {
        group.members.push(member);
      }
    },
    removeMemberFromGroup: (state, action) => {
      const { groupId, memberId } = action.payload;
      const group = state.groups.find((g) => g.id === groupId);
      if (group) {
        group.members = group.members.filter((m) => m.id !== memberId);
      }
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
  setGroups,
  addGroup,
  deleteGroup,
  updateGroup,
  selectGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  setLoading,
  setError,
} = groupsSlice.actions;

export default groupsSlice.reducer;
