import { Request, Response, NextFunction } from "express";
import authConfig from "../config/auth.config";
import jwt from "jsonwebtoken";
import Send from "../utils/response.utils";

export interface DecodedToken {
    userId: number;
}

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : undefined;

    if (!token){
        return Send.unauthorized(res, null);
    }

    try{
        const decodedToken = jwt.verify(token, authConfig.secret) as DecodedToken;

        req.userId = decodedToken.userId;

        next();
    }catch(err){
        console.error("Authentication failed: ", err);
        return Send.unauthorized(res, null);
    }
}

const refreshTokenValidation = (req: Request, res: Response, next: NextFunction) => {
    
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken){
        return Send.unauthorized(res, { message: "No refresh token provided"});
    }

    try{
        const decodedToken = jwt.verify(refreshToken, authConfig.secret) as DecodedToken;

        req.userId = decodedToken.userId;

        next();
    }catch(err){
        console.error("Refresh token authentication failed");
        return Send.unauthorized(res, { message: "Invalid or expired refresh token" });
    }
}

export {
    authenticateUser,
    refreshTokenValidation
}