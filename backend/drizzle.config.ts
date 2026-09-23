import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

export default defineConfig({
    out: './drizzle',
    dialect: 'postgresql',
    schema: ['./src/db/schema/users.ts', './src/db/schema/progress.ts'],
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});