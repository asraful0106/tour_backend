import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async(paylod: Partial<IUser>) =>{
    const {name, email} = paylod;
    const user = await User.create({name, email});
    return user;
};

const getAllUser = async() => {
    const users = await User.find();
    const totalUser = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUser
        }
    }
}

export const userService = {
    createUser,
    getAllUser
}