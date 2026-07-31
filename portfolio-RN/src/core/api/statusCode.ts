/// HTTP Status Code constants.
/// Rule 1 from 01_architecture_network_di.md:
/// HTTP status codes MUST be referenced via StatusCode enum. Never use raw numbers like 401 or 200.

export enum StatusCode {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  timeout = 408,
  internalServerError = 500,
  badGateway = 502,
  serviceUnavailable = 503,
}
