import {makeEncodePassword} from '../encode-password';
import {generateSalt} from '../index';

describe('Encode password', () => {
  it('When makeEncodePassword Then encodePassword',
      async () => {
        const salt = await generateSalt();
        const encodePassword = makeEncodePassword(salt);

        expect(encodePassword).not.toBeNull();
        expect(encodePassword).toBeInstanceOf(Function);
      });
  it('When encodePassword Then return encoded password',
      async () => {
        const salt = await generateSalt();
        const encodePassword = makeEncodePassword(salt);
        const password = 'password';
        const encodedPassword = await encodePassword(password);

        expect(encodedPassword).toHaveLength(60);
        expect(encodedPassword).not.toEqual(password);
      });
});
