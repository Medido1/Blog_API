import express from 'express';
import postsRouter from './routes/postsRouter.js';
import usersRouter from './routes/usersRouter.js';
import passport from './config/passport.js';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import prisma from './prismaClient.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000 //ms
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 *1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined
      }
    )
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  })
});

app.listen(PORT, (error) => {
  if (error) {
    console.log(error)
  }
  console.log(`server running on port ${PORT}`)
});