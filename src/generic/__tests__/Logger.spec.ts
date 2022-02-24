import {Logger} from '../Logger';

describe('Generic Logger tests', () => {
  it('When generic logger Then generic logger',
      async () => {
        const logger = new Logger();

        expect(logger).not.toBeNull();
        expect(logger).toBeInstanceOf(Logger);
      });
});
