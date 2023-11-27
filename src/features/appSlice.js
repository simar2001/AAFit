import { createSlice } from "@reduxjs/toolkit";

// STATE
const initialState = {
  mobile: false,
  addPostIsOpen: false,
  addSearchIsOpen: false,
  posts: [],
  selectedProfile: {},
  searchTerms: {},
};

// MUTATIONS
export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    SetScreen: (state, action) => {
      state.mobile = action.payload.mobile;
    },
    setAddPostModal: (state, action) => {
      state.addPostIsOpen = action.payload.addPostIsOpen;
    },
    setAddSearchModal: (state, action) => {
      state.addSearchIsOpen = action.payload.addSearchIsOpen;
    },
    SetPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    SetSelectedProfile: (state, action) => {
      state.selectedProfile = action.payload.selectedProfile;
    },
    SetSearchTerms: (state, action) => {
      state.searchTerms = action.payload.searchTerms;
    }
  },
});

// ACTIONS
export const {
  SetScreen,
  setAddPostModal,
  setAddSearchModal,
  SetPosts,
  SetSelectedProfile,
  SetSearchTerms,
} = appSlice.actions;

// GETTERS
export const selectMobile = (state) => state.app.mobile;
export const selectAddPostIsOpen = (state) => state.app.addPostIsOpen;
export const selectAddSearchIsOpen = (state) => state.app.addSearchIsOpen;
export const selectPosts = (state) => state.app.posts;
export const SelectProfile = (state) => state.app.selectedProfile;
export const SelectSearchTerms = (state) => state.app.searchTerms;

// MAIN
export default appSlice.reducer;
