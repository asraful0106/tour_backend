import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { envVars } from '../../config/env';
import bcrypt from "bcryptjs";
import { JwtPayload } from 'jsonwebtoken';

const createUser = async (paylod: Partial<IUser>) => {
    const { email, password, ...rest } = paylod;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "User Already Exist!");
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    });
    return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User Not Found.");
    }

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized.");
        }
        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized.");
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }
    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdatedUser;
}



const getAllUser = async () => {
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
    updateUser,
    getAllUser
}