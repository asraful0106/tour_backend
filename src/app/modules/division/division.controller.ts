import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../util/catchAsync";
import { DivisionServices } from "./division.service";
import { sendResposne } from "../../util/sendResponse";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await DivisionServices.createDivision(req.body);
    sendResposne(res, {
        statusCode: 201, 
        success: true,
        message: "Division created successfully.",
        data: result
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllDivisions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await DivisionServices.getAllDivisions();
    sendResposne(res, {
        statusCode: 200,
        success: true,
        message: "Division retrived successfully.",
        data: result
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSingleDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await DivisionServices.getSingleDivision(req.params.slug);
    sendResposne(res, {
        statusCode: 200,
        success: true,
        message: "Division retrived successfully.",
        data: result
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await DivisionServices.updateDivision(req.params.id, req.body);
    sendResposne(res, {
        statusCode: 201,
        success: true,
        message: "Division udpaded successfully.",
        data: result
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await DivisionServices.deleteDivision(req.params.id);
    sendResposne(res, {
        statusCode: 200,
        success: true,
        message: "Division deleted successfully.",
        data: result
    });
});

export const DivisionControllers = {
    createDivision,
    getAllDivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision
}