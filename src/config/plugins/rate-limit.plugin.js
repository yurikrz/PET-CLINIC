import ratelimit from 'express-rate-limit';

export const limitRequest = (maxRequest, windonwsMinutes, message) => {
  return ratelimit({
    max: maxRequest,
    windowMs: windonwsMinutes * 60 * 1000,
    message: message,
  });
};
