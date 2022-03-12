import {makeGenerateId} from './generate-id';
import {loggerConfig} from '../../config/Logger';

const logger = loggerConfig();

export const generateId = makeGenerateId(logger);
