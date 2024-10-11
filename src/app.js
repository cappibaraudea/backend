import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import taskRouter from "./routes/task.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "https://cappibaraudea.github.io",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", taskRouter);

export default app;
