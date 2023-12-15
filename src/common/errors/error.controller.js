import { envs } from '../../config/enviroments/enviroments.js';
import { AppError } from './appError.js';
import Error from './error.model.js';

const handleCastError23505 = () =>
  new AppError('Duplicate field value: please another value', 400);
const handleCastError22P02 = () =>
  new AppError('Invalid data type in database', 400);

const handleJWTExpireError = () =>
  new AppError('Your token has expired! Please login again', 401);
const handleJWTError = () =>
  new AppError('Invalid token! Please login again', 401);
const handleCastError23503 = (message) => new AppError(message, 400);

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = async (err, res) => {
  await Error.create({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });

  if (err.isOperational) {
    //errores operacionales
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //errores de programacion
    console.log('ERROR: ', err);
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (envs.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (envs.NODE_ENV === 'production') {
    let error = err;
    console.log(err.name);
    if (err.parent?.code === '23505') error = handleCastError23505();
    if (err.parent?.code === '22P02') error = handleCastError22P02();
    if (err.parent?.code === '23503')
      error = handleCastError23503(err.parent?.detail);
    if (err.name === 'TokenExpiredError') error = handleJWTExpireError();
    if (err.name === 'JsonWebTokenError') error = handleJWTError();

    sendErrorProd(error, res);
  }
};
