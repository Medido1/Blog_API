import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import passport from "../config/passport.js";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

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
    const token = jwt.sign(
      {id: user.id},
      JWT_SECRET,
      {expiresIn: '1d'}
    );
    const {password, ...safeUser} = user;

    return res.json({
      message: "login successful",
      user: safeUser,
      token: token
    })
  })(req, res, next)
};

// Middleware to verify the token:
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403);
    req.user = decoded;
    next();
  })
}

export const userLogout = (req, res, next) => {
  req.logOut(err => {
    if (err) return next(err);
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

