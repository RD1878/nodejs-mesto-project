import StatusCode from '../constants/errors';

export default class UnauthorizedError extends Error {
  statusCode: (typeof StatusCode)[keyof typeof StatusCode];

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCode.UNAUTHORIZED;
  }
}
