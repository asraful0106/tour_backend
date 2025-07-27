import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../util/catchAsync";
import { PaymentService } from "./payment.services";
import { sendResposne } from "../../util/sendResponse";
import { envVars } from "../../config/env";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId;
    const result = await PaymentService.initPayment(bookingId as string)
    sendResposne(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: result,
    });
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const successPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await PaymentService.successPayment(query as Record<string, string>)

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const failPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await PaymentService.faildPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cancelPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await PaymentService.cancelPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});

export const PaymentController = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};