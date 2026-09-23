import type { SignOptions } from "jsonwebtoken";

const authConfig = {
    secret: process.env.JWT_SECRET as string,
    secret_expiration_time: process.env.JWT_ACCESS_TOKEN_EXPIRATION as SignOptions["expiresIn"],
    refresh_secret_expiration_time: process.env.JWT_REFRESH_TOKEN_EXPIRATION as SignOptions["expiresIn"],
}

export default authConfig;
