import { deleteImageFromCloudinary } from "../../config/cloudinary.congig";
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {
    const existingDivision = await Division.findOne({ name: payload.name });
    if (existingDivision) {
        throw new AppError(400, "A division with this name already exists.");
    }
    const divsion = await Division.create(payload);
    return divsion;
}

const getAllDivisions = async () => {
    const divisions = await Division.find({});
    const totalDivisions = await Division.countDocuments();
    return {
        data: divisions,
        meta: {
            total: totalDivisions
        }
    }
}

const getSingleDivision = async (slug: string) => {
    const division = await Division.findOne({ slug });
    return {
        data: division
    }
}

const updateDivision = async (id: string, paylod: Partial<IDivision>) => {
    const existngDivision = await Division.findById(id);
    if (!existngDivision) {
        throw new AppError(400, "Division is not found!");
    }

    const duplicateDivision = await Division.findOne({
        name: paylod.name,
        _id: {$ne: id}
    });
    if(duplicateDivision){
        throw new AppError(400, "A division with this name already exists.");
    }

    const updatedDivision = await Division.findByIdAndUpdate(id, paylod, { new: true, runValidators: true });

    if(paylod.thumbnail && existngDivision.thumbnail){
        await deleteImageFromCloudinary(existngDivision.thumbnail);
    }
    
    return updatedDivision;
}

const deleteDivision = async (id: string) => {
    await Division.findByIdAndDelete(id);
    return null;
}

export const DivisionServices = {
    createDivision,
    getAllDivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision
}