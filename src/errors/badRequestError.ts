import ErrorStatusCode from '../constants/errors';

export default class BadRequestError extends Error {
  statusCode: (typeof ErrorStatusCode)[keyof typeof ErrorStatusCode];

  constructor(message: string) {
    super(message);
    this.statusCode = ErrorStatusCode.BAD_REQUEST;
  }
}
