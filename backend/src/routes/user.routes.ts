import { Router} from 'express';
import * as userController from "../controllers/user.controller";
import { refreshTokenValidation } from "../middleware/auth.middleware";

const router = Router();

router.post('/signup', userController.registerUser);

router.post('/login', userController.loginUser);

router.post('/refresh', refreshTokenValidation, userController.refreshToken);

router.post('/logout', userController.logoutUser);

export default router;
