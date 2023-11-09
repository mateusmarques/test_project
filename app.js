import express from 'express';
import cookieParser from 'cookie-parser';

import './config/init';
import './db/init';
import router from './app/routes/router';
import advices from './app/routes/advices';
import {
  internalServerErrorHandler,
  validationErrorHandler,
} from './app/middlewares';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use('/', router);
app.use('/advice', advices);

// error handling
app.use(validationErrorHandler);
app.use(internalServerErrorHandler);

export default app;
