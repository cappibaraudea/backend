import { Router } from "express";
import {
  register,
  login,
  logOut,
  profile,
  verifyAuth,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const authRouter = Router();

authRouter.post("/register", validateSchema(registerSchema), register);

authRouter.post("/login", validateSchema(loginSchema), login);

authRouter.post("/logout", logOut);

authRouter.get("/profile", authRequired, profile);

authRouter.get("/verifyAuth", verifyAuth);

export default authRouter;
