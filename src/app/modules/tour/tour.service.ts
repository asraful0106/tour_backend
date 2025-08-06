import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../util/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const creatTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }
    const tour = await Tour.create(payload);
    return tour;
}

const getAllTours = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Tour.find(), query);
    const tours = await queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ]);

    return {
        data,
        meta
    }
}

const updateTour = async (id: string, payload: Partial<ITour>) => {
    const existingTour = await Tour.findById(id);
    if (!existingTour) {
        throw new AppError(400, "Tour is not found!");
    }

    // cheking is there are existing images
    if(payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0){
        payload.images = [...payload.images, ...existingTour.images];
    }

    if(payload.deletedImages && payload.deletedImages.length > 0 && existingTour.images && existingTour.images.length > 0){
        const restDbImages = existingTour.images.filter(imageUrl => !payload.deletedImages?.includes(imageUrl));
        
        const updatedPayloadImages = (payload.images || [])
        .filter(imageUrl => !payload.deletedImages?.includes(imageUrl))
        .filter(imageUrl => !restDbImages.includes(imageUrl));

        payload.images = [...restDbImages, ...updatedPayloadImages];
    }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });
    
    return updatedTour;
}

const deleteTour = async (id: string) => {
    const existingTour = await Tour.findById(id);
    if (!existingTour) {
        throw new AppError(400, "Tour is not found!");
    }
    return await Tour.findByIdAndDelete(id);
}

const createTourType = async (payload: ITourType) => {
    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }
    return await TourType.create({ name: payload.name });
}

const getallTourTypes = async () => {
    const allTour = await TourType.find({});
    return allTour;
}

const updateTourType = async (id: string, paylod: ITourType) => {
    const existingTourType = await TourType.findOne({ name: paylod.name });
    if (!existingTourType) {
        throw new Error("Tour type is not found!");
    }

    const updatedTourType = await TourType.findByIdAndUpdate(id, paylod, { new: true });
    return updatedTourType;
}

const deleteTourType = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new AppError(400, "Tour type is not found!");
    }
    return await TourType.findByIdAndDelete(id);
}

export const TourServices = {
    creatTour,
    getAllTours,
    updateTour,
    deleteTour,
    createTourType,
    getallTourTypes,
    updateTourType,
    deleteTourType
}