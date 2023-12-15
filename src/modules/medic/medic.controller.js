import { catchAsync } from '../../common/errors/catchAsync.js';
import { validateMedic, validatePartialMedic } from './medic.schema.js';
import { MedicService } from './medic.service.js';

export const findAllMedics = catchAsync(async (req, res, next) => {
  const medics = await MedicService.findAll();
  return res.status(200).json(medics);
});

export const createMedic = catchAsync(async (req, res, next) => {
  const { hasError, errorMessage, medicData } = validateMedic(req.body);
  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessage,
    });
  }

  const medic = await MedicService.create(medicData);

  return res.status(200).json(medic);
});

export const findOneMedic = catchAsync(async (req, res, next) => {
  const { medic } = req;
  return res.status(200).json(medic);
});

export const updateMedic = catchAsync(async (req, res, next) => {
  const { hasError, errorMessage, medicData } = validatePartialMedic(req.body);
  const { medic } = req;
  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessage,
    });
  }

  const medicUpdated = await MedicService.update(medic, medicData);

  return res.status(200).json(medicUpdated);
});

export const deleteMedic = catchAsync(async (req, res, next) => {
  const { medic } = req;
  await MedicService.delete(medic);
  return res.status(204).json(null);
});
