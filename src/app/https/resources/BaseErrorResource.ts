export class BaseErrorResource extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }

  static NotFound(msg?: string) {
    return new BaseErrorResource(msg || 'Resource Not Found', 404);
  }

  static Unauthorized(msg?: string) {
    return new BaseErrorResource(msg || 'Unauthorized', 401);
  }

  static Forbidden(msg?: string) {
    return new BaseErrorResource(msg || 'Forbidden', 403);
  }

  static BadRequest(msg?: string) {
    return new BaseErrorResource(msg || 'Bad Request', 400);
  }
}
