import {UserProfileDto} from '../../dto/UserProfileDto';
import {User, UserModel} from '../../models/User';
import {HydratedDocument} from 'mongoose';

/**
 * Maker-function for get user profile.
 *
 * @return {Function} function to get user profile
 */
export const makeGetUserProfile = () => {
  /**
   * Function to get user profile.
   *
   * @param {string} email of user profile to get
   * @return {Promise<UserProfileDto>} user profile
   */
  return async function getUserProfile(
      email: string,
  ): Promise<UserProfileDto> {
    const userModel: HydratedDocument<User> = await UserModel.findOne({email});

    return {
      email: userModel.email,
      firstName: userModel.firstName,
      lastName: userModel.lastName,
    };
  };
};
