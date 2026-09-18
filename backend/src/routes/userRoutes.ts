import { Router, type Request, type Response } from 'express';
import  * as userController  from '../db/queries/users.queries';

const router = Router();

router.post('/newuser', async (req: Request, res: Response) => {
    try{
        const newUser = await userController.insertUser(req.body);
        res.status(201).json(newUser);
    }catch(err){
        res.status(500).json({
            error: `Failed to create user, ${err}`, 
        });
    }
});

export default router;