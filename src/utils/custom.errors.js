export class UserAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserAlreadyExistsError";
    this.statusCode = 409;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}
