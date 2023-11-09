import { ValidationError } from 'express-json-validator-middleware';

export function validationErrorHandler(error, request, response, next) {
  const isValidationError = error instanceof ValidationError;
  if (response.headersSent || !isValidationError) {
    return next(error);
  }

  response.status(422).json({
    errors: error.validationErrors,
  });

  next();
}
