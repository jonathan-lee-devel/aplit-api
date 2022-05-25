import {makeHandleExistingUser} from '../handle-existing-user';

describe('Handle existing user', () => {
  it('When makeHandleExistingUser Then handleExistingUser',
      async () => {
        // @ts-ignore
        const handleExistingUser = makeHandleExistingUser({});

        expect(handleExistingUser).not.toBeNull();
        expect(handleExistingUser).toBeInstanceOf(Function);
      });
  it('When handleExistingUser And No Existing User Then True',
      async () => {
        // @ts-ignore
        const handleExistingUser = makeHandleExistingUser({
          findOne: () => {
            return null;
          },
        });

        const result = await handleExistingUser('email');

        expect(result).toBeTruthy();
      });
  it('When handleExistingUser and Existing User Email Verified Then False',
      async () => {
        const handleExistingUser = makeHandleExistingUser({
          // @ts-ignore
          findOne: () => {
            return {
              emailVerified: true,
            };
          },
        });

        const result = await handleExistingUser('email');

        expect(result).not.toBeTruthy();
      });
  it('When handleExistingUser and Existing User Not Email Verified Then True',
      async () => {
        let findByIdAndDeleteCalled = false;
        const handleExistingUser = makeHandleExistingUser({
          // @ts-ignore
          findOne: () => {
            return {
              emailVerified: false,
            };
          },
          // @ts-ignore
          findByIdAndDelete: () => {
            findByIdAndDeleteCalled = true;
          },
        },
        );

        const result = await handleExistingUser('email');

        expect(result).toBeTruthy();
        expect(findByIdAndDeleteCalled).toBeTruthy();
      });
});
