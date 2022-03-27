import {makeGetUserProfile} from './get-user-profile';
import {makeUpdateUserProfile} from './update-user-profile';
import {UserProfileDto} from '../../data/dto/UserProfileDto';

export type GetUserProfileFunction = (
    email: string,
) => Promise<UserProfileDto>;
export const getUserProfile = makeGetUserProfile();

export type UpdateUserProfileFunction = (
    profile: UserProfileDto,
) => Promise<UserProfileDto>;
export const updateUserProfile = makeUpdateUserProfile();
