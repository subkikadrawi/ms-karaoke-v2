enum EHttpResponseStatus {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
  NotImplemented = 501,
  ServiceUnavailable = 503,
}

enum EHttpResponseStatusDesc {
  OK = '200 OK!',
  Created = 'Resource created successfully!',
  NoContent = 'Request was successful, but no content to return',
  BadRequest = 'Bad request. Please check the request parameters',
  Unauthorized = 'Unauthorized -',
  Forbidden = 'Forbidden. You do not have permission to access this resource',
  NotFound = 'Not found. The requested resource does not exist',
  InternalServerError = 'Internal server error. Something went wrong.',
  NotImplemented = 'Not implemented. The server does not support this feature',
  ServiceUnavailable = 'Service unavailable. The server is temporarily down',
}

export {EHttpResponseStatus, EHttpResponseStatusDesc};
