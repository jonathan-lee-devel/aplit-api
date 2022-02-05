import expressSession from 'express-session';

export const expressSessionConfig = () => expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});
