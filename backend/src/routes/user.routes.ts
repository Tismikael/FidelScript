import { Router} from 'express';
import * as userController from "../controllers/user.controller";
import { refreshTokenValidation } from "../middleware/auth.middleware";
import { authLimiter } from "../config/rateLimit.config";

const router = Router();

router.post('/signup', authLimiter, userController.registerUser);

router.post('/login', authLimiter, userController.loginUser);

router.post('/refresh', refreshTokenValidation, userController.refreshToken);

router.post('/logout', userController.logoutUser);

export default router;
