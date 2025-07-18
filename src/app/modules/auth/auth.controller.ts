import httpStatusCode from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../util/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResposne } from "../../util/sendResponse";
import { setAuthCookie } from '../../util/manageCookies';
import AppError from '../../errorHelpers/AppError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    // Setting access and refresh token to the cookies
    setAuthCookie(res, loginInfo);

    sendResposne(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Logged In Successfully.",
        data: loginInfo
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        throw new AppError(httpStatusCode.BAD_REQUEST, "No refresh token recieved from cookies");
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string);

    setAuthCookie(res, tokenInfo);

    sendResposne(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "New Acess Token Retrived Successfuly.",
        data: tokenInfo
    });
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken
}