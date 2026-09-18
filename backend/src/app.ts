import express, { type Express, type Request, type Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/node-postgres';
import userRoute from './routes/userRoutes';

const app: Express = express();
app.use(cors());
app.use(express.json());
const db = drizzle(process.env.DATABASE_URL!);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use('/', userRoute);

app.listen(3000, () => {
    console.log('listening on port 3000');
});