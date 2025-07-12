import httpStatusCode from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../util/catchAsync";
import { sendResposne } from "../../util/sendResponse";
import { userService } from './userService';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const createdUser = userService.createUser(req.body);
    sendResposne(res, {
        success: true,
        statusCode: httpStatusCode.CREATED,
        message: "User created successfully",
        data: createdUser,
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getAllUser();
    sendResposne(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Users fetched successfully",
        data: users.data,
        meta: users.meta
    })
});

export const userController = {
    createUser,
    getAllUser
}