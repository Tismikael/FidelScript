import {type Request, type Response, type NextFunction } from 'express';
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from '../db';
import { users } from '../db/schema';
import * as userQueries from '../db/queries/users.queries';
import * as progressQueries from '../db/queries/progress.queries';
import Send from '../utils/response.utils';
import authConfig from '../config/auth.config';


const JWT_SECRET = authConfig.secret;

const signAccessToken = (userId: number) =>
    jwt.sign({ userId }, JWT_SECRET, { expiresIn: authConfig.secret_expiration_time });

const signRefreshToken = (userId: number) =>
    jwt.sign({ userId }, JWT_SECRET, { expiresIn: authConfig.refresh_secret_expiration_time });

const setRefreshCookie = (res: Response, refreshToken: string) =>
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return Send.badRequest(res, {message: "Missing fields from request body" });
        }

        const user = await db.transaction(async (tx) => {
            const newUser = await userQueries.createUser(tx, username, email, password);
            await progressQueries.createProgress(tx, newUser.id);
            return newUser;
        });

        const accessToken = signAccessToken(user.id);
        const refreshToken = signRefreshToken(user.id);

        return setRefreshCookie(res, refreshToken)
            .status(201)
            .json({ userId: user.id, username: user.username, email: user.email, token: accessToken });
    } catch (err: unknown) {
        const pgErrorCode = (err as { cause?: { code?: string } })?.cause?.code;
        if (pgErrorCode === '23505') {
            return Send.exists(res, { message: "Email already exists" });
        }
        next(err);
    }
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return Send.badRequest(res, { message: "Missing fields from request body" });
        }

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1); 

        const isValidPassword = user?.password
            ? await bcrypt.compare(password, user.password)
            : false;

        if (!user || !isValidPassword) {
            return Send.unauthorized(res, { message: "Invalid email or password" });
        }

        const accessToken = signAccessToken(user.id);
        const refreshToken = signRefreshToken(user.id);

        return setRefreshCookie(res, refreshToken)
            .status(200)
            .json({ userId: user.id, username: user.username, email: user.email, token: accessToken });
    } catch (err) {
        next(err);
    }

}

export {
    registerUser,
    loginUser
}