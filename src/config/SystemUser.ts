import {User} from '../models/User';

export const SystemUser: User = {
  email: 'system@split.jonathanlee.io',
  firstName: 'system',
  lastName: 'system',
  password: '',
  emailVerified: true,
  registrationVerificationToken: null,
  passwordResetToken: null,
};
