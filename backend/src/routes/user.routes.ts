import { Router} from 'express';
import * as userController from "../controllers/user.controller";

const router = Router();

router.post('/signup', userController.registerUser);

router.post('/login', userController.loginUser);

export default router;
