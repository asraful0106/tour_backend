import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from '../../util/userTokens';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';
import { sendEmail } from '../../util/sendEmail';

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

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return {
        accessToken: newAccessToken
    }
}

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user?.password as string);
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, "Old password does not match");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

    user?.save();
}

// Set Password
const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found!");
    }

    if (user.password && user.auth.some(providerObject => providerObject.provider === "google")) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "You have already set you password. Now you can chagne the password from your profile password update!");
    }

    const hashedPassword = await bcryptjs.hash(
        plainPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    );

    const credentialAuthProvider: IAuthProvider = {
        provider: "credential",
        providerId: user.email
    }

    const auth: IAuthProvider[] = [...user.auth, credentialAuthProvider];

    user.password = hashedPassword;
    user.auth = auth;

    await user.save();
}

const forgotPassword = async (email: string) => {
    const isUserExist = await User.findOne({email});

    if(!isUserExist){
        throw new AppError(httpStatusCode.BAD_REQUEST, "User does not exist.");
    }

    if(!isUserExist.isVerified){
        throw new AppError(httpStatusCode.BAD_REQUEST, "User is not verified.");
    }

    if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
        throw new AppError(httpStatusCode.BAD_REQUEST, `User is ${isUserExist.isActive}`);
    }

    if(isUserExist.isDeleted){
        throw new AppError(httpStatusCode.BAD_REQUEST, "User is deleted.");
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const restToken = jwt.sign(jwtPayload, envVars.JWT_SECRET, {
        expiresIn: "10m"
    });

    const restUrlLink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${restToken}`;

    sendEmail({
        to: isUserExist.email,
        subject: "Password Rest",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            restUrlLink
        }
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
    if(payload.id != decodedToken.userId){
        throw new AppError(httpStatusCode.FORBIDDEN, "User does not exist");
    }

    const isUserExist = await User.findById(decodedToken.userId);

    if(!isUserExist) {
        throw new AppError(httpStatusCode.FORBIDDEN, "User does not exist.");
    }

    const hashedPassword = await bcryptjs.hash(
        payload.newPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    );

    isUserExist.password = hashedPassword;

    await isUserExist.save();
}


export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword
}