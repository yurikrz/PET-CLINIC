export const catchAsync = (fn) => {
  return (req, res, next) => {
    // fn(req, res, next).catch(error => next(error))
    // se puede abreviar de esta forma la linea de arriba.
    fn(req, res, next).catch(next);
  };
};
