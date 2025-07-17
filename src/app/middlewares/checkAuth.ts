import httpStatusCode from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from '../util/jwt';
import { envVars } from '../config/env';
import { JwtPayload } from 'jsonwebtoken';


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try{
        const accessToken = req.headers.authorization;

        if(!accessToken){
            throw new AppError(httpStatusCode.FORBIDDEN, "NO Token Recieved");
        }

        const verifedToken = verifyToken(accessToken, envVars.JWT_SECRET) as JwtPayload;

        if(!authRoles.includes(verifedToken.role)){
            throw new AppError(httpStatusCode.FORBIDDEN, "You are not permitted to view this route!");
        }
        req.user = verifedToken;
        next();
    }catch(err) {
        next(err);
    }
}