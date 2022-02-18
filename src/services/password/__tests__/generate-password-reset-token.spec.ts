import dotenv from 'dotenv';
import {makeGeneratePasswordResetToken} from '../generate-password-reset-token';

dotenv.config();

beforeAll(() => {
});

beforeEach(() => {
});

describe('Generate password reset token', () => {
  it('When makeGeneratePasswordResetToken Then generatePasswordResetToken',
      async () => {
        const generatePasswordResetToken = makeGeneratePasswordResetToken();
        expect(generatePasswordResetToken).not.toBeNull();
        expect(generatePasswordResetToken).toBeInstanceOf(Function);
      });
});

afterEach(() => {
});

afterAll(() => {
});
