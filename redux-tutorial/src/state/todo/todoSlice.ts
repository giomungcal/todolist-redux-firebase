import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Task {
  id: number;
  title: string;
  dateAdded: string;
}

type TaskState = Task[];

const initialState: TaskState = [];

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    ADD_TODO: (state, action: PayloadAction<Task>) => {
      if (state.some((task) => task.title === action.payload.title)) {
        console.log("Task existing already!");
        return;
      }
      console.log(action.payload);

      return [...state, action.payload];
    },
    DELETE_TODO: (state, action: PayloadAction<number>) => {
      const updatedArray = state.filter((task) => action.payload !== task.id);

      // Below can be done also, since createSlice allows for direct mutation.
      // state.splice(action.payload, 1);

      return [...updatedArray];
    },
    EDIT_TODO: (state, action: PayloadAction<[string, number]>) => {
      // Approach 1:
      // const task = state.find((task) => task.id === action.payload[1]);
      // if (task) {
      //   task.title = action.payload[0];
      // }

      console.log(state.findIndex((task) => task.title === action.payload[0]));
      const isThereASimilarTask = state.findIndex(
        (task) => task.title === action.payload[0]
      );

      if (isThereASimilarTask !== -1) {
        console.log("There is a similar task!");

        return;
      }

      return state.map((task) =>
        task.id === action.payload[1]
          ? { ...task, title: action.payload[0] }
          : task
      );
    },
  },
});

export default todoSlice.reducer;
export const { ADD_TODO, DELETE_TODO, EDIT_TODO } = todoSlice.actions;
