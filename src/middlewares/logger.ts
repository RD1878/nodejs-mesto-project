import expressWinston from 'express-winston';
import { transports, format } from 'winston';
import path from 'path';

const requestLogger = expressWinston.logger({
  transports: [
    new transports.File({
      filename: path.join('logs', 'request.log'),
    }),
  ],
  format: format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new transports.File({
      filename: path.join('logs', 'error.log'),
    }),
  ],
  format: format.json(),
});

export { requestLogger, errorLogger };
