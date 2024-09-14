import { Button } from "@/components/ui/button";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootType } from "./state/store";
import {
  ADD_TODO,
  COMPLETE_TODO,
  DELETE_TODO,
  EDIT_TODO,
  FETCH_TODO,
  UPDATE_TODO,
} from "./state/todo/todoSlice";

import { Check, Edit2, PlusCircle, Trash2, X } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import { Toggle } from "./components/ui/toggle";
import { TOGGLE_THEME } from "./state/todo/darkModeSlice";

const App: React.FC = () => {
  const todo = useSelector((state: RootType) => state.todo);
  const darkmode = useSelector((state: RootType) => state.darkmode);
  const dispatch = useDispatch<AppDispatch>();

  const taskRef = useRef<HTMLInputElement>(null);

  // Focus on Add Task Input field on mount
  useEffect(() => {
    taskRef.current?.focus();
  }, []);

  const hasMounted = useRef<boolean>(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    dispatch(FETCH_TODO());
  }, [dispatch]);

  const addTask = (e: FormEvent) => {
    e.preventDefault();

    if (taskRef.current && taskRef.current.value.trim()) {
      const task = {
        firebaseId: String(Date.now()),
        id: Date.now(),
        title: taskRef.current.value.trim(),
        isCompleted: false,
      };
      dispatch(UPDATE_TODO({ task: task, actionType: "add" }));
      dispatch(ADD_TODO(task));
      taskRef.current.value = "";
    }
  };

  // Edit Task

  const [editText, setEditText] = useState<string>("");
  const [editingTask, setEditingTask] = useState<number | null>(null);

  const startEditTask = (taskId: number) => {
    setEditingTask(taskId);
    const currentTodo = todo.find((task) => task.id === taskId);
    if (currentTodo) setEditText(currentTodo.title);
  };

  const editTask = (e: FormEvent, taskId: number) => {
    e.preventDefault();

    if (editText.trim()) {
      dispatch(EDIT_TODO([editText, taskId]));
      const selectTask = todo.find((task) => task.id === taskId);
      if (selectTask) {
        const updatedTask = { ...selectTask, title: editText };
        dispatch(UPDATE_TODO({ task: updatedTask, actionType: "update" }));
      }
      setEditingTask(null);
      setEditText("");
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditText("");
  };

  // Dark Mode emerlu

  const theme = darkmode.toggleState
    ? { backgroundColor: "black", color: "white", borderColor: "black" }
    : { backgroundColor: "white", color: "black" };

  return (
    <div
      className={`min-h-screen flex justify-center items-center transition-colors ${
        darkmode.toggleState && "bg-gray-950"
      }`}
    >
      <Card style={theme} className="w-full max-w-md transition-colors">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">Todo List</h1>
            <Toggle onClick={() => dispatch(TOGGLE_THEME())}>
              {darkmode.toggleState ? "Dark" : "Light"}
            </Toggle>
          </div>

          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              ref={taskRef}
              placeholder="Add a new task"
              onKeyPress={(e) => e.key === "Enter" && addTask(e)}
            />
            <Button onClick={addTask}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          <ul className="space-y-2">
            {todo.map((task) => (
              <li key={task.id} className="flex items-center space-x-2">
                {editingTask === task.id ? (
                  <>
                    <Input
                      type="text"
                      value={editText}
                      className="flex-grow"
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && editTask(e, task.id)
                      }
                    />
                    <Button size="icon" onClick={(e) => editTask(e, task.id)}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={cancelEdit}>
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.isCompleted}
                      onCheckedChange={() => {
                        dispatch(COMPLETE_TODO(task.id));
                        const selectTask = todo.find(
                          (todo) => todo.id === task.id
                        );
                        if (selectTask) {
                          const updatedTask = {
                            ...selectTask,
                            isCompleted: !selectTask.isCompleted,
                          };
                          dispatch(
                            UPDATE_TODO({
                              task: updatedTask,
                              actionType: "update",
                            })
                          );
                        }
                      }}
                    />
                    <span
                      className={`flex-grow ${
                        task.isCompleted && "line-through"
                      }`}
                    >
                      {task.title}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className={`text-black`}
                      onClick={() => startEditTask(task.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className={`text-black`}
                      onClick={() => {
                        dispatch(DELETE_TODO(task.id));
                        dispatch(
                          UPDATE_TODO({ task: task, actionType: "delete" })
                        );
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
    // <div className="h-screen w-full flex flex-col justify-center items-center gap-y-10">
    //   <Card className="w-[350px] p-8 flex flex-col gap-y-4">
    //     <Label htmlFor="title">Task:</Label>
    //     <Input type="text" id="title" ref={taskRef} placeholder="Task Name" />
    //     <Button onClick={handleSubmit}>Submit</Button>
    //   </Card>

    //   <div className="w-[600px]">
    //     <Table>
    //       <TableCaption>A complete list of tasks by Gio.</TableCaption>
    //       <TableHeader>
    //         <TableRow>
    //           <TableHead>Task</TableHead>
    //           <TableHead className="w-[100px] text-left">Date Added</TableHead>
    //           <TableHead className="w-[100px] text-left">Edit</TableHead>
    //           <TableHead className="w-[100px] text-red-600">Delete</TableHead>
    //         </TableRow>
    //       </TableHeader>
    //       <TableBody>
    //         {todo.map((task, index) => (
    //           <TableRow key={index}>
    //             <TableCell className="font-medium">{task.title}</TableCell>
    //             <TableCell className="text-left opacity-70">
    //               {task.dateAdded}
    //             </TableCell>
    //             <TableCell>
    //               <Dialog>
    //                 <DialogTrigger>Edit</DialogTrigger>
    //                 <DialogContent>
    //                   <DialogHeader>
    //                     <DialogTitle className="mb-2">
    //                       Edit the task:
    //                     </DialogTitle>
    //                     <Input
    //                       type="text"
    //                       id="title"
    //                       ref={editRef}
    //                       placeholder="Edit task"
    //                     />
    //                     <Button onClick={(e) => handleEditSubmit(e, index)}>
    //                       Submit
    //                     </Button>
    //                   </DialogHeader>
    //                 </DialogContent>
    //               </Dialog>
    //             </TableCell>
    //             <TableCell>
    //               <Button
    //                 className="bg-red-600"
    //                 onClick={() => dispatch(DELETE_TODO(index))}
    //               >
    //                 Delete
    //               </Button>
    //             </TableCell>
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </div>
    // </div>
  );
};

export default App;
