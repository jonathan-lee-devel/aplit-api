import {connect} from 'mongoose';
import {getLoggingPrefix} from './Logger';
import npmlog from 'npmlog';

export const databaseConfig = (logger: npmlog.Logger) => {
  connect(process.env.DATABASE_URL)
      .then((_) => {
        logger.info(
            getLoggingPrefix(),
            'Connected to database: %s', process.env.DATABASE_URL,
        );
      })
      .catch((err) => {
        logger.error(
            getLoggingPrefix(),
            'Could not connect to database: %s -> %j',
            process.env.DATABASE_URL, err,
        );
      });
};
