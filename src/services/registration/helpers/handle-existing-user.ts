import {HydratedDocument, Model} from 'mongoose';
import {User} from '../../../models/User';
import {HandleExistingUserFunction} from '../index';

export const makeHandleExistingUser = (
    UserModel: Model<User>,
): HandleExistingUserFunction => {
  /**
    * Helper function used to handle case of existing user.
    *
    * @param {string} email email for which case is to be checked
    * @return {Promise<boolean>} flag to indicate if user existed
    */
  return async function(email: string) : Promise<boolean> {
    const existingUser: HydratedDocument<User> = await UserModel.findOne({
      email,
    });

    if (!existingUser) {
      return true;
    }

    if (existingUser.emailVerified) {
      return false;
    }

    await UserModel.findByIdAndDelete(existingUser.id);
    return true;
  };
};
