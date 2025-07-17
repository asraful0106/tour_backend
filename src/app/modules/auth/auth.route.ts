import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const authRouter = Router();

authRouter.post("/login", AuthControllers.credentialsLogin);

export default authRouter;