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

routerTodo.get("/task", getAllTask);
routerTodo.post("/task", valdasiTodo(), createTodo);
routerTodo.get("/task/:id", valdasiTodo(), getIdTodo);
routerTodo.put("/task/:id", valdasiTodo(), updateIdTodo);
routerTodo.delete("/task/:id", valdasiTodo(), deleteIdTodo);

export default routerTodo;
