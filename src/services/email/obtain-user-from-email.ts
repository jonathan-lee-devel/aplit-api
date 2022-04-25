import {Logger} from '../../generic/Logger';
import {Model} from 'mongoose';
import {User} from '../../models/User';
import {ObtainUserFromEmailFunction} from './index';

export const makeObtainUserFromEmail = (
    logger: Logger,
    UserModel: Model<User>,
): ObtainUserFromEmailFunction => {
  return async function obtainUserFromEmail(email: string) {
    return UserModel.findOne({email: email});
  };
};
