import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateReqest";
import { creatUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const userRouter = Router();

userRouter.post('/register', validateRequest(creatUserZodSchema), userController.createUser);
// For getting all user
userRouter.get('/all-users', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userController.getAllUser);
userRouter.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), userController.updateUser);

export default userRouter;