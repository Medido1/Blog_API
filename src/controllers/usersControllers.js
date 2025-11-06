import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import passport from "../config/passport.js";

export const registerUser = async (req, res, next) => {
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
};

// passport.authenticate returns a function factory; 
// you MUST immediately invoke it with (req, res, next) 
// to trigger the authentication and execute the custom logic.
export const userLogin = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({message: info.message})
      }
      // to enable session persistence
      req.logIn(user, (err) => {
        if (err) return next(err)
        const { password, ...safeUser } = user;
        return res.json({message: "Login succesful", user: safeUser})
      })
    })(req, res, next)
};

export const userLogout = (req, res, next) => {
  req.logOut(err => {
    if (err) return next(err);
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

