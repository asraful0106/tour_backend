import { Router } from "express";
import { userController } from "./user.controller";

const userRouter = Router();

userRouter.post('/register', userController.createUser);
userRouter.get('/users', userController.getAllUser);

export default userRouter;