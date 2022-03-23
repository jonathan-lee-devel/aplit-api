import {makeGenerateId} from './generate-id';
import {loggerConfig} from '../../config/Logger';

const logger = loggerConfig();

export type generateIdFunctionType = () => Promise<string>;
export const generateId = makeGenerateId(logger);
