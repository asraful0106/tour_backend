import { Router } from "express";
import { TourControllers } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation";
import { validateRequest } from "../../middlewares/validateReqest";

const tourRouter: Router = Router();

// -----------------------------Tour Routes------------------
tourRouter.get("/", TourControllers.getAllTours);
tourRouter.post("/create", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), validateRequest(createTourZodSchema), TourControllers.createTour);
tourRouter.patch("/:id", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), validateRequest(updateTourZodSchema), TourControllers.updateTour);
tourRouter.delete("/:id", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), TourControllers.deleteTour);

// -----------TourType Routes-----------
tourRouter.get("/tour-types", TourControllers.getAllTourTypes);
tourRouter.post("/create-tour-type", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema), TourControllers.createTourType);
tourRouter.patch("/tour-types/:id", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), validateRequest(createTourTypeZodSchema), TourControllers.updateTourType);

export default tourRouter;