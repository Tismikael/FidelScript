import { serial, text, varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar({ length: 256 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password"),
    oauthProvider: varchar("oauth_provider", { length: 255}),
    oauthId: varchar("oauth_id", { length: 255}),
    createdAt: timestamp("created_at", { withTimezone: true}).defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

