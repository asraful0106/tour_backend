import httpStatusCode from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../util/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResposne } from "../../util/sendResponse";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    sendResposne(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Logged In Successfully.",
        data: loginInfo
    });
});

export const AuthControllers = {
    credentialsLogin
}