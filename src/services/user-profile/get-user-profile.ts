import {UserProfileDto} from '../../data/dto/UserProfileDto';
import {User, UserModel} from '../../models/User';
import {HydratedDocument} from 'mongoose';
import {GetUserProfileFunction} from './index';

/**
 * Maker-function for get user profile.
 *
 * @return {GetUserProfileFunction} function to get user profile
 */
export const makeGetUserProfile = (): GetUserProfileFunction => {
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
