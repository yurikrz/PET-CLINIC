import { AppError } from '../../common/errors/appError.js';
import { catchAsync } from '../../common/errors/catchAsync.js';
import { PetService } from './pet.service.js';

export const validExistPet = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const pet = await PetService.findOne(id);

  if (!pet) {
    return next(new AppError(`Pet with id ${id} not found!.`, 404));
  }
  req.pet = pet;
  next();
});
