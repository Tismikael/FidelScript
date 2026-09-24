import rateLimit from "express-rate-limit";
import Send from "../utils/response.utils";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

export const authLimiter = rateLimit({
    windowMs: FIFTEEN_MINUTES,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        Send.tooManyRequests(res, { message: "Too many login/signup attempts. Please try again later." });
    },
});

export const apiLimiter = rateLimit({
    windowMs: FIFTEEN_MINUTES,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        Send.tooManyRequests(res, { message: "Too many requests. Please try again later." });
    },
});
