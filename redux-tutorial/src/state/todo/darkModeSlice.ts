import { createSlice } from "@reduxjs/toolkit";

interface DarkState {
  toggleState: boolean;
}

const initialState: DarkState = {
  toggleState: false,
};

const darkModeSlice = createSlice({
  name: "darkmode",
  initialState,
  reducers: {
    TOGGLE_THEME: (state) => {
      state.toggleState = !state.toggleState;
    },
  },
});

export const { TOGGLE_THEME } = darkModeSlice.actions;
export default darkModeSlice.reducer;
