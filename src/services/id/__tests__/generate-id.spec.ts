import {makeGenerateId} from '../generate-id';
import {Logger} from '../../../generic/Logger';

const innerLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
};
const logger = new Logger(innerLogger);

describe('generate ID', () => {
  it('When make generateId Then generateId',
      async () => {
        const generateId = makeGenerateId(logger);

        expect(generateId).not.toBeNull();
        expect(generateId).toBeInstanceOf(Function);
      });
  it('When generateId Then generateId',
      async () => {
        const generateId = makeGenerateId(logger);

        const generatedId = await generateId();
        const numberOfCharactersPerByte = 2;

        expect(generatedId).toHaveLength(12 * numberOfCharactersPerByte);
      });
});
