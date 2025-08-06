import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Tour } from '../tour/tour.model';
import { Payment } from '../payment/payment.model';
import { PAYMENT_STATUS } from '../payment/payment.interface';
import { ISsLCommerz } from '../sslCommerz/sslCommerz.interface';
import { SSLService } from '../sslCommerz/sslCommerz.service';

const getTransactionId = (user: string): string => {
    return `tran_${Date.now()}_${user}_${Math.floor(Math.random() * 1000)}`;
}

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransactionId(userId);

    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId);

        if (!user?.phone || !user.address) {
            throw new AppError(httpStatusCode.BAD_REQUEST, "Please Update your Profile to Book a Tour.");
        }

        const tour = await Tour.findById(payload.tour).select("costFrom");

        if (!tour?.costFrom) {
            throw new AppError(httpStatusCode.BAD_REQUEST, "No Tour Cost Found!");
        }

        const amount = Number(tour.costFrom) * Number(payload.guestCount);

        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload
        }], { session });

        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PAYMENT_STATUS.UNPAID,
            transactionId,
            amount
        }]);

        const updateBooking = await Booking.findByIdAndUpdate(
            booking[0]._id,
            { payment: payment[0]._id },
            { new: true, runValidators: true, session }
        )
            .populate("user", "name email phone address")
            .populate("tour", "title costForm")
            .populate("payment");

        const sslPayload: ISsLCommerz = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            address: (updateBooking?.user as any).address,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            email: (updateBooking?.user as any).email,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            phoneNumber: (updateBooking?.user as any).phone,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            name: (updateBooking?.user as any).name,
            amount,
            transactionId
        }

        const sslPayment = await SSLService.sslPaymentInit(sslPayload);

        await session.commitTransaction(); //transaction
        session.endSession();

        return {
            paymentUrl: sslPayment.GateWayPageURL,
            booking: updateBooking
        }
    } catch (err) {
        await session.abortTransaction(); //rollback
        session.endSession();
        throw err;
    }
}


const getUserBookings = async () => {

    return {}
};

const getBookingById = async () => {
    return {}
};

const updateBookingStatus = async (

) => {

    return {}
};

const getAllBookings = async () => {

    return {}
};

export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};