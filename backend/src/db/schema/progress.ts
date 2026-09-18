import { serial, smallint, integer, pgTable } from 'drizzle-orm/pg-core';
import { users } from './users';

export const progress = pgTable('progress', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    familyId: smallint("family_id"),
    partCompletion: smallint("part_completion"),
});

export type Progress = typeof progress.$inferSelect;
export type NewProgress = typeof progress.$inferInsert;