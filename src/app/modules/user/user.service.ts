import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import { envVars } from '../../config/env';
import bcrypt from "bcryptjs";
import { string } from 'zod';

const createUser = async(paylod: Partial<IUser>) =>{
    const {email, password, ...rest} = paylod;
    
    const isUserExist = await User.findOne({email});

    if(isUserExist){
        throw new AppError(httpStatusCode.BAD_REQUEST, "User Already Exist!");
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));
    const authProvider: IAuthProvider = {provider: "credentials", providerId: email as string}

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    });
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