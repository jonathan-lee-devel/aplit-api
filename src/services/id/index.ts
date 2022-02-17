import {makeGenerateId} from './id-generate';
import {loggerConfig} from '../../config/Logger';

const logger = loggerConfig();

export const generateId = makeGenerateId(logger);
