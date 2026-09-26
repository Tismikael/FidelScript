import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.routes';
import progressRoute from './routes/progress.routes';
import { apiLimiter } from './config/rateLimit.config';

const app: Express = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(apiLimiter);

app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true });
});

app.use('/v1/auth', userRoute);
app.use('/v1/progress', progressRoute);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});
