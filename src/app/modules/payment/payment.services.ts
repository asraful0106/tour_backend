import { Booking } from './../booking/booking.model';
import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { Payment } from "./payment.model"
import { ISsLCommerz } from '../sslCommerz/sslCommerz.interface';
import { SSLService } from '../sslCommerz/sslCommerz.service';
import { PAYMENT_STATUS } from './payment.interface';
import { BOOKING_STATUS } from '../booking/booking.interface';

const initPayment = async (bookingId: string) => {
    const payment = await Payment.findOne({ booking: bookingId });

    if (!payment) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Payment Not Found! You have not booked this tour.");
    }

    const booking = await Booking.findById(payment.booking);

    const sslPayload: ISsLCommerz = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        address: (booking?.user as any).address,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        email: (booking?.user as any).email,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        phoneNumber: (booking?.user as any).phone,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: (booking?.user as any).name,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);
    return {
        paymentUrl: sslPayment.GatewayPageURL
    }
};


const successPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.PAID },
            { new: true, runValidators: true, session }
        );

        await Booking.findByIdAndUpdate(
            updatedPayment?.booking,
            { status: BOOKING_STATUS.COMPLETE },
            { runValidators: true, session }
        );

        await session.commitTransaction();
        session.endSession();
        return {
            success: true,
            message: "Payment Completed Successfully."
        }
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
}


const faildPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.FAILED },
            { new: true, runValidators: true, session }
        );

        await Booking.findByIdAndUpdate(
            updatedPayment?.booking,
            { status: BOOKING_STATUS.FAILED },
            { runValidators: true, session }
        );

        await session.commitTransaction();
        session.endSession();
        return {
            success: true,
            message: "Payment Failed."
        }
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
}


const cancelPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.CANCELED },
            { new: true, runValidators: true, session }
        );

        await Booking.findByIdAndUpdate(
            updatedPayment?.booking,
            { status: BOOKING_STATUS.CANCEL },
            { runValidators: true, session }
        );

        await session.commitTransaction();
        session.endSession();
        return {
            success: true,
            message: "Payment Cancelled."
        }
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
}

export const PaymentService = {
    initPayment,
    successPayment,
    faildPayment,
    cancelPayment
}