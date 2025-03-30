export class ValidationError extends Error {
  constructor(errors, statusCode = 400) {
    super("Validation failed");
    this.name = "ValidationError";
    this.statusCode = statusCode;
    this.details = errors;
  }
}
