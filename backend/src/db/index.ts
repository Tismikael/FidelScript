// import { drizzle } from "drizzle-orm/node-postgres";

// export const db = drizzle({
//     connection: {
//         connectionString: process.env.DATABASE_URL,
//         ssl: true,
//     }
// });

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(process.env.DATABASE_URL!);
