import {UserProfileDto} from '../../dto/UserProfileDto';
import {HydratedDocument} from 'mongoose';
import {User, UserModel} from '../../models/User';

export const makeUpdateUserProfile = () => {
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
