export async function internalServerErrorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const error = {
    title: err.message,
    errorId: res.sentry,
  };

  if (err.statusCode === 500) {
    error.title = 'API server encountered an unexpected error.';
  }

  if (res.headersSent) {
    return next(error);
  }

  res.status(status).json(error);
  next();
}
