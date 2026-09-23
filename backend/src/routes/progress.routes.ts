import { Router } from 'express';
import * as progressController from '../controllers/progress.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateUser);

router.get('/me', progressController.getProgress);

router.patch('/me/complete-part', progressController.completePartHandler);

export default router;
