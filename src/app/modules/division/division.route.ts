import { Router } from "express";
import { DivisionControllers } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";
import { validateRequest } from "../../middlewares/validateReqest";

const divisionRouter: Router = Router();

divisionRouter.get("/", DivisionControllers.getAllDivisions);
divisionRouter.post("/create", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), validateRequest(createDivisionZodSchema), DivisionControllers.createDivision);
divisionRouter.get("/:slug", DivisionControllers.getSingleDivision);
divisionRouter.patch("/:id", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), validateRequest(updateDivisionZodSchema), DivisionControllers.updateDivision);

export default divisionRouter;