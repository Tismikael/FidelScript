import { eq } from 'drizzle-orm';
import { EmptyRelations } from 'drizzle-orm';
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { PgAsyncTransaction } from 'drizzle-orm/pg-core';
import { db } from '../index';
import { progress, type NewProgress, type Progress } from '../schema';

// The curriculum has 34 letter families (see frontend/src/lib/data/letters.json),
// and each lesson has 4 assessment parts: Matching, Recognition pt 1, Recognition pt 2, Guess the Sound.
export const MAX_FAMILY_ID = 34;
export const PARTS_PER_LESSON = 4;

export class ProgressAlreadyCompleteError extends Error {}
export class ProgressNotFoundError extends Error {}

const createProgress = async (
    tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
    userId: number
): Promise<Progress> => {
    const newProgress: NewProgress = {
        userId,
        familyId: 1,
        partCompletion: 0,
    };

    const [row] = await tx.insert(progress).values(newProgress).returning();
    return row;
}

const getProgressByUserId = async (userId: number): Promise<Progress | undefined> => {
    const [row] = await db
        .select()
        .from(progress)
        .where(eq(progress.userId, userId))
        .limit(1);
    return row;
}

const completePart = async (userId: number): Promise<Progress> => {
    return db.transaction(async (tx) => {
        const [current] = await tx
            .select()
            .from(progress)
            .where(eq(progress.userId, userId))
            .for('update')
            .limit(1);

        if (!current) {
            throw new ProgressNotFoundError();
        }

        if (current.familyId === MAX_FAMILY_ID && current.partCompletion === PARTS_PER_LESSON) {
            throw new ProgressAlreadyCompleteError();
        }

        const nextPart = (current.partCompletion ?? 0) + 1;

        const rolledOver = nextPart === PARTS_PER_LESSON && (current.familyId ?? 1) < MAX_FAMILY_ID;

        const nextFamilyId = rolledOver ? (current.familyId ?? 1) + 1 : current.familyId;
        const nextPartCompletion = rolledOver ? 0 : nextPart;

        const [updated] = await tx
            .update(progress)
            .set({ familyId: nextFamilyId, partCompletion: nextPartCompletion })
            .where(eq(progress.userId, userId))
            .returning();

        return updated;
    });
}

export {
    createProgress,
    getProgressByUserId,
    completePart,
}
