import httpStatusCode from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../util/catchAsync";
import { sendResposne } from "../../util/sendResponse";
import { userService } from './user.service';

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
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload  = req.body;
    const user = await userService.updateUser(userId, payload, verifiedToken);

    sendResposne(res, {
        success: true, 
        statusCode: httpStatusCode.CREATED,
        message: "User Updated Successfully",
        data: user
    });
})

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
    updateUser,
    getAllUser
}