import { Router } from "express";
import {
  createTask,
  deleteTask,
  editTask,
  getTask,
  getTasks,
  getFeed,
  makeAttend,
} from "../controllers/task.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { taskSchema } from "../schemas/task.schema.js";

export const taskRouter = Router();

taskRouter.get("/tasks", authRequired, getTasks);

taskRouter.get("/task/:taskId", authRequired, getTask);

taskRouter.post("/task", authRequired, validateSchema(taskSchema), createTask);

taskRouter.delete("/task/:taskId", authRequired, deleteTask);

taskRouter.put(
  "/task/:taskId",
  authRequired,
  validateSchema(taskSchema),
  editTask
);

taskRouter.get("/feed", authRequired, getFeed);

taskRouter.post("/attend", authRequired, makeAttend);

export default taskRouter;
