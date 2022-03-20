import {UserProfileDto} from '../../data/dto/UserProfileDto';
import {HydratedDocument} from 'mongoose';
import {User, UserModel} from '../../models/User';

/**
 * Maker-function to update user profile.
 *
 * @return {Function} function to update user profile
 */
export const makeUpdateUserProfile = () => {
  /**
   * Function to update user profile.
   *
   * @param {UserProfileDto} profile which is to be updated
   * @return {Promise<UserProfileDto>} updated profile
   */
  return async function updateUserProfile(
      profile: UserProfileDto,
  ): Promise<UserProfileDto> {
    const userModel: HydratedDocument<User> = await UserModel
        .findOne({email: profile.email});

    userModel.firstName = profile.firstName;
    userModel.lastName = profile.lastName;

    await userModel.save();

    return profile;
  };
};
