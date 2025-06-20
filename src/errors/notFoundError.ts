import ErrorStatusCode from '../constants/errors';

export default class NotFoundError extends Error {
  statusCode: (typeof ErrorStatusCode)[keyof typeof ErrorStatusCode];

  constructor(message: string) {
    super(message);
    this.statusCode = ErrorStatusCode.NOT_FOUND;
  }
}
