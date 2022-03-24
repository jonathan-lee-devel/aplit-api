import crypto from 'crypto';
import {Logger} from '../../generic/Logger';
import {GenerateIdFunction} from './index';

/**
 * Maker-function for the function to generate IDs.
 *
 * @param {Logger} logger used when generating IDs
 * @return {Function} function to generate IDs
 */
export const makeGenerateId = (
    logger: Logger,
): GenerateIdFunction => {
  /**
   * Function to generate IDs.
   *
   * @return {Promise<string>} generated ID
   */
  return async function generateId(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      crypto.randomBytes(12, (err, buffer) => {
        if (err) {
          logger.error(`Error: ${err.message}`);
          return reject(err);
        }
        return resolve(buffer.toString('hex'));
      });
    });
  };
};
