/// Endpoints and API key constants.
/// Rule 1 from 01_architecture_network_di.md:
/// EndPoints.baseUrl for all API calls. EndPoints.domain for static assets. ApiKeys for headers/body/query keys.

export const EndPoints = {
  domain: 'https://loadr.app',
  baseUrl: 'https://loadr.app/api/v1',
  projects: '/projects',
  skills: '/skills',
  experience: '/experience',
  contact: '/contact',
} as const;

export const ApiKeys = {
  data: 'data',
  message: 'message',
  status: 'status',
  authorization: 'Authorization',
  bearer: 'Bearer',
  contentType: 'Content-Type',
  applicationJson: 'application/json',
} as const;
