import { Router } from "express";
import {
  registerUser, userLogin,
   userLogout, authenticateJWT,
   verifyToken} from '../controllers/usersControllers.js';

const usersRouter = Router();

usersRouter.post("/register", registerUser);
usersRouter.post('/login', userLogin);
usersRouter.get('/logout', userLogout);
usersRouter.get('/profile', authenticateJWT, verifyToken);

export default usersRouter;
