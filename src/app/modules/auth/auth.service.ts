import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from '../../util/userTokens';
import { JwtPayload } from 'jsonwebtoken';
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


    const userToken = createUserTokens(isUserExist);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
    }
}

const getNewAccessToken = async (refreshToken: string) =>{
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return {
        accessToken: newAccessToken
    }
}

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user?.password as string);
    if(!isOldPasswordMatch) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, "Old password does not match");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND)); 

    user?.save();
}


export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}