import passport from 'passport';
import bcrypt from 'bcrypt';
import {Strategy as LocalStrategy} from 'passport-local';
import {Profile, Strategy as GoogleStrategy, VerifyCallback} from
  'passport-google-oauth20';
import {HydratedDocument, Model} from 'mongoose';
import {User} from '../models/User';
import {Logger} from '../generic/Logger';

export const passportConfig =
    ( logger: Logger,
        UserModel: Model<User>)
        : passport.PassportStatic => {
      passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (
          accessToken: string | Request,
          refreshToken: string,
          profile: Profile,
          done: VerifyCallback) => {
        const user = await UserModel.findOne({googleProfileId: profile.id});
        if (user) {
          return done(null, user);
        } else {
          const existingUser =
              await UserModel.findOne({email: profile.emails[0].value});
          if (existingUser) {
            existingUser.googleProfileId = profile.id;
            await existingUser.save();
            return done(null, existingUser);
          }
          const newUser: User = {
            googleProfileId: profile.id,
            email: profile.emails[0].value,
            emailVerified: false,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            password: undefined,
            passwordResetToken: undefined,
            registrationVerificationToken: undefined,
          };
          let newUserDocument;
          try {
            newUserDocument = await new UserModel(newUser).save();
          } catch (err) {
            logger.error(err);
          }
          return done(null, newUserDocument);
        }
      }));
      passport.use(
          new LocalStrategy(async (username, password, done) => {
            try {
              const foundUser: HydratedDocument<User> =
                  await UserModel.findOne({
                    email: username,
                  });

              if (!foundUser) {
                return done(null, false, {message: 'Invalid username'});
              }

              if (!foundUser.emailVerified) {
                return done(null, false, {
                  message: 'User\'s email not verified'});
              }

              const validPassword = await bcrypt.compare(
                  password,
                  foundUser.password,
              );
              if (!validPassword) {
                return done(null, false, {message: 'Invalid password'});
              }

              return done(null, foundUser);
            } catch (err) {
              if (err) return done(err);
            }
          }),
      );

      passport.serializeUser((user: HydratedDocument<User>, done) => {
        done(null, user.id);
      });

      passport.deserializeUser((id, done) => {
        UserModel.findById(id, (err: any, user: User) => {
          done(err, user);
        });
      });

      return passport;
    };
