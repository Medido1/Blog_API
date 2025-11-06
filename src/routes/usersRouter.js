import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../prismaClient.js";
import passport from "../config/passport.js";

const usersRouter = Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      const error = new Error("Username already exists");
      error.status = 400;
      return next(error);
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashedPwd,
      },
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
});

// passport.authenticate returns a function factory; 
// you MUST immediately invoke it with (req, res, next) 
// to trigger the authentication and execute the custom logic.
usersRouter.post('/login', (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({message: info.message})
    }
    // to enable session persistence
    req.logIn(user, (err) => {
      if (err) return next(err)
      return res.json({message: "Login succesful"}, user)
    })
  })(req, res, next)
});

export default usersRouter;
