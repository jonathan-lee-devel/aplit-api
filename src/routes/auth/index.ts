import express from 'express';
import {configureGetGoogleAuthRoute} from './get-google-auth-route';
import {configureGetGoogleAuthCallbackRoute} from
  './get-google-auth-callback-route';

// eslint-disable-next-line new-cap
const router = express.Router();

configureGetGoogleAuthRoute(
    router,
);

configureGetGoogleAuthCallbackRoute(
    router,
);

export {router as AuthRouter};
