import httpStatusCode from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../util/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResposne } from "../../util/sendResponse";
import { clearCookies, setAuthCookie } from '../../util/manageCookies';
import AppError from '../../errorHelpers/AppError';
import { createUserTokens } from '../../util/userTokens';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';
import passport from 'passport';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", async (err: any, user: any, info: any) => {
        if (err) {
            return next(new AppError(401, err));
        }

        if (!user) {
            return next(new AppError(401, info.message));
        }


        const userTokens = await createUserTokens(user);

        delete user.toObject().password;
        // const { password: pass, ...rest } = user.toObject()
        setAuthCookie(res, userTokens);
        sendResposne(res, {
            success: true,
            statusCode: httpStatusCode.OK,
            message: "User Logged In Successfully.",
            data: user
        });
    })
});

// const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
// const loginInfo = await AuthServices.credentialsLogin(req.body);

// // Setting access and refresh token to the cookies
// setAuthCookie(res, loginInfo);

// sendResposne(res, {
//     success: true,
//     statusCode: httpStatusCode.OK,
//     message: "User Logged In Successfully.",
//     data: loginInfo
// });
// });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
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
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    clearCookies(res, ['accessToken', 'refreshToken']);
    sendResposne(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Logged Out Successfuly.",
        data: null
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword, oldPassword } = req.body;
    const decodedToken = req.user as JwtPayload;

    await AuthServices.changePassword(oldPassword, newPassword, decodedToken);

    sendResposne(res, {
        success: true,
        statusCode: httpStatusCode.CREATED,
        message: "Password Successfuly Changed",
        data: null
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const redirectTo = req.query.state as string || "";

    const user = req.user;
    if (!user) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User is not found.");
    }

    const tokenInfo = createUserTokens(user);
    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.GOOGLE_CALLBACK_URL}${redirectTo}`);
});

// Set Password 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const {password} = req.body;

    await AuthServices.resetPassword(decodedToken.userId, password);

    sendResposne(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Password Changed Successfully!",
        data: null
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {email} = req.body;

    await AuthServices.forgotPassword(email);

    sendResposne(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Email Sent Successfully.",
        data: null
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    await AuthServices.resetPassword(req.body, decodedToken);

    sendResposne(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Password Changed Successfully",
        data: null
    });
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
    googleCallbackController
}