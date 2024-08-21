import express from "express";
import {
  createTodo,
  deleteIdTodo,
  getAllTask,
  getIdTodo,
  updateIdTodo,
} from "../controller/todoList.js";
import { valdasiTodo } from "../init/validasiData.js";
const routerTodo = express.Router();

routerTodo.get("/tasks", getAllTask);
routerTodo.post("/tasks", valdasiTodo(), createTodo);
routerTodo.get("/tasks/:id", valdasiTodo(), getIdTodo);
routerTodo.put("/tasks/:id", valdasiTodo(), updateIdTodo);
routerTodo.delete("/tasks/:id", valdasiTodo(), deleteIdTodo);

export default routerTodo;
