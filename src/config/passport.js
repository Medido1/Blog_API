import passport from 'passport';
import { Strategy } from 'passport-local';
import prisma from '../prismaClient.js';
import bcrypt from 'bcrypt';

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: {username}
      });

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
)

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

export default passport;