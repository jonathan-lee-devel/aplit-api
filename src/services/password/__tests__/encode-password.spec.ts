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
});
