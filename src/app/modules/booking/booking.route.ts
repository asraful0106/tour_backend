import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateReqest";
import { createBookingZodSchema, updateBookingStatusZoodSchema } from "./booking.validation";
import { BookingController } from "./booking.controller";

const bookingRouter: Router = Router();

// api/v1/booking
bookingRouter.post("/",
    checkAuth(...Object.values(Role)),
    validateRequest(createBookingZodSchema),
    BookingController.createBooking
);

// api/v1/booking
bookingRouter.get("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    BookingController.getAllBookings
);

// api/v1/booking/my-bookings
bookingRouter.get("/my-bookings",
    checkAuth(...Object.values(Role)),
    BookingController.getUserBookings
);

// api/v1/booking/bookingId
bookingRouter.get("/:bookingId",
    checkAuth(...Object.values(Role)),
    BookingController.getSingleBooking
);

// api/v1/booking/bookingId/status
bookingRouter.patch("/:bookingId/status",
    checkAuth(...Object.values(Role)),
    validateRequest(updateBookingStatusZoodSchema),
    BookingController.updateBookingStatus
);

export default bookingRouter;