import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Firebase
import { log } from "console";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

interface Task {
  firebaseId: string;
  id: number;
  title: string;
  isCompleted: boolean;
}

type TaskState = Task[];

const initialState: TaskState = [];

// Fetch from FireBase
export const FETCH_TODO = createAsyncThunk("todo/fetchTodos", async () => {
  const querySnapshot = await getDocs(collection(db, "todos"));
  const todos: TaskState = [];
  querySnapshot.forEach((doc) => {
    const taskData = doc.data() as Task;
    todos.push({ ...taskData, firebaseId: doc.id });
  });
  console.log(todos);

  return todos;
});

// Update FireBase
export const UPDATE_TODO = createAsyncThunk(
  "todo/updateTodos",
  async ({
    task,
    actionType,
  }: {
    task: Task;
    actionType: "add" | "update" | "delete";
  }) => {
    const taskDocRef = doc(db, "todos", task.firebaseId);

    if (actionType === "add") {
      await setDoc(taskDocRef, task);
    } else if (actionType === "update") {
      await setDoc(taskDocRef, task, { merge: true });
    } else if (actionType === "delete") {
      await deleteDoc(taskDocRef);
    }
  }
);

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
      return [...updatedArray];
    },
    EDIT_TODO: (state, action: PayloadAction<[string, number]>) => {
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
    COMPLETE_TODO: (state, action: PayloadAction<number>) => {
      const updatedArray = state.map((task) =>
        task.id === action.payload
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      );
      return updatedArray;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FETCH_TODO.pending, () => {
        console.log("Fetching todos...");
      })
      .addCase(FETCH_TODO.fulfilled, (state, action) => {
        return [...action.payload];
      })
      .addCase(FETCH_TODO.rejected, (state, action) => {
        console.error("Failed to fetch todos:", action.error.message);
      })
      .addCase(UPDATE_TODO.pending, () => {
        console.log("Updating FireBase...");
      })
      .addCase(UPDATE_TODO.fulfilled, (state, action) => {
        // const { task, actionType } = action.meta.arg;
        console.log("Updated!");

        // if (actionType === "add") {
        //   return [...state, task];
        // } else if (actionType === "update") {
        //   return state.map((t) => (t.id === task.id ? task : t));
        // } else if (actionType === "delete") {
        //   return state.filter((t) => t.id !== task.id);
        // }
      });
  },
});

export default todoSlice.reducer;
export const { ADD_TODO, DELETE_TODO, EDIT_TODO, COMPLETE_TODO } =
  todoSlice.actions;
