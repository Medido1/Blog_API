import { Router } from "express";
import {registerUser, userLogin, userLogout} from '../controllers/usersControllers.js';

const usersRouter = Router();

usersRouter.post("/register", registerUser);
usersRouter.post('/login', userLogin);
usersRouter.get('/logout', userLogout);


export default usersRouter;
