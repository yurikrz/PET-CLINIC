import express from 'express';
import morgan from 'morgan';
import { router } from './routes/index.js';
import { AppError } from './common/errors/appError.js';
import { globalErrorHandler } from './common/errors/error.controller.js';
import { envs } from './config/enviroments/enviroments.js';
import { enableCors } from './config/plugins/cors.plugin.js';
import { limitRequest } from './config/plugins/rate-limit.plugin.js';
import sanitizer from 'perfect-express-sanitizer';
import hpp from 'hpp';
import helmet from 'helmet';

const app = express();
const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:8080',
  'http://localhost:5173',
];
const rateLimit = limitRequest(
  15,
  60,
  'Too many request from this IP, please try again an hour'
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit);
app.use(helmet());
app.use(hpp());
app.use(
  sanitizer.clean({
    xss: true,
    noSQL: true,
    sql: false,
  })
);

enableCors(app, ACCEPTED_ORIGINS);

if (envs.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('me estoy ejecutando en desarrollo');
}

//rutas
app.use('/api/v1', router);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

export default app;
