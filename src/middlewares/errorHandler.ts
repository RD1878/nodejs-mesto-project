import { NextFunction, Request, Response } from 'express';
import StatusCode from '../constants/errors';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const { statusCode = StatusCode.INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === StatusCode.INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
};

export default errorHandler;
