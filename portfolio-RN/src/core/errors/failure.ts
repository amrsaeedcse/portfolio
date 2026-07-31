/// Standardized error handling classes for React Native architecture.
/// Rule 2 from 01_architecture_network_di.md: STRICTLY use Failure classes.

export abstract class Failure {
  constructor(public readonly message: string = 'unexpected_error') {}
}

export class ServerFailure extends Failure {
  constructor(message: string = 'server_error', public readonly statusCode?: number) {
    super(message);
  }

  static fromAxiosError(error: any): ServerFailure {
    const message = error?.response?.data?.message ?? error?.message ?? 'server_error';
    const status = error?.response?.status;
    return new ServerFailure(message, status);
  }
}

export class UnexpectedFailure extends Failure {
  constructor(message: string = 'unexpected_error') {
    super(message);
  }
}

export class CacheFailure extends Failure {
  constructor(message: string = 'cache_error') {
    super(message);
  }
}
