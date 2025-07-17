import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { generateToken } from '../../util/jwt';
import { envVars } from '../../config/env';

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "Eamil or Password dose nto match!");
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);

    if (!isPasswordMatched) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "Eamil or Password dose nto match!");
    }


    const JwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(JwtPayload, envVars.JWT_SECRET, envVars.JWT_ACCESS_EXPIRES);
    return { accessToken };
}


export const AuthServices = {
    credentialsLogin
}