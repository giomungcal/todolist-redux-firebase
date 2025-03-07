import { configureStore } from "@reduxjs/toolkit";
import darkmodeReducer from "./todo/darkModeSlice";
import todoReducer from "./todo/todoSlice";

export const store = configureStore({
  reducer: {
    todo: todoReducer,
    darkmode: darkmodeReducer,
  },
});

// TypeScript

export type RootType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
