import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';

import './config/init';
import './db/init';
import router from './routes/router';
import advices from './routes/advices';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/advice', advices);
app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const error = {
    title: err.message,
    errorId: res.sentry,
  };

  if (err.statusCode === 500) {
    error.title = 'API server encountered an unexpected error.';
  }

  res.status(status).json(error);
  next();
});

export default app;
