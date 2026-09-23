import { type Request, type Response, type NextFunction } from 'express';
import Send from '../utils/response.utils';
import * as progressQueries from '../db/queries/progress.queries';
import { ProgressNotFoundError, ProgressAlreadyCompleteError } from '../db/queries/progress.queries';

const getProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId!;

        const row = await progressQueries.getProgressByUserId(userId);

        if (!row) {
            return Send.notFound(res, { message: "No progress found for this user" });
        }

        return res.status(200).json({ familyId: row.familyId, partCompletion: row.partCompletion });
    } catch (err) {
        next(err);
    }
}

const completePartHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId!;

        const row = await progressQueries.completePart(userId);

        return res.status(200).json({ familyId: row.familyId, partCompletion: row.partCompletion });
    } catch (err) {
        if (err instanceof ProgressNotFoundError) {
            return Send.notFound(res, { message: "No progress found for this user" });
        }
        if (err instanceof ProgressAlreadyCompleteError) {
            return Send.exists(res, { message: "Nothing left to complete" });
        }
        next(err);
    }
}

export {
    getProgress,
    completePartHandler,
}
