import {makeHandleExistingUser} from '../handle-existing-user';

describe('Handle existing user', () => {
  it('WHen makeHandleExistingUser Then handleExistingUser',
      async () => {
        // @ts-ignore
        const handleExistingUser = makeHandleExistingUser({});

        expect(handleExistingUser).not.toBeNull();
        expect(handleExistingUser).toBeInstanceOf(Function);
      });
});
