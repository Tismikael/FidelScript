import { serial, varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar({ length: 256 }),
    email: varchar({ length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true}).defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

