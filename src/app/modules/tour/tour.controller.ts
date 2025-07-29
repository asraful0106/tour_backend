import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../util/catchAsync";
import { TourServices } from "./tour.service";
import { sendResposne } from "../../util/sendResponse";
import { ITour } from "./tour.interface";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file => file.path)
    }
    const result = await TourServices.creatTour(payload);
    sendResposne(res, {
        statusCode: 201,
        success: true,
        message: "Tour created successfully.",
        data: result
    })
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllTours = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await TourServices.getAllTours(query as Record<string, string>);

    sendResposne(res, {
        statusCode: 200,
        success: true,
        message: "Tour recived successfully.",
        data: result.data,
        meta: result.meta
    })
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload : ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file => file.path)
    }
    const result = await TourServices.updateTour(req.params.id, payload);
    sendResposne(res, {
        statusCode: 201,
        success: true,
        message: "Tour updated successfully.",
        data: result
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.deleteTour(req.params.id);
    sendResposne(res, {
        statusCode: 201,
        success: true,
        message: "Tour deleted successfully.",
        data: result
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllTourTypes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.getallTourTypes();
    sendResposne(res, {
        statusCode: 200,
        success: true,
        message: "Tour Types retrived successfully.",
        data: result
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.createTourType(req.body);
    sendResposne(res, {
        statusCode: 201,
        success: true,
        message: "Tour Type created successfully.",
        data: result
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.updateTourType(req.params.id, req.body);
    sendResposne(res, {
        statusCode: 201,
        success: true,
        message: "Tour Type updated successfully.",
        data: result
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteToutType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.deleteTourType(req.params.id);
    sendResposne(res, {
        statusCode: 200,
        success: true,
        message: "Tour Type deleted successfully.",
        data: result
    })
});

export const TourControllers = {
    getAllTours,
    createTour,
    updateTour,
    deleteTour,
    getAllTourTypes,
    createTourType,
    updateTourType,
    deleteToutType
}