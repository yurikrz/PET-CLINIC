import { AppError } from '../../common/errors/appError.js';
import { catchAsync } from '../../common/errors/catchAsync.js';
import { AppointmentService } from './appointment.service.js';

export const validExistAppointment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await AppointmentService.findOne(id);

  if (!appointment) {
    return next(new AppError(`Appointment with id ${id} not found!.`, 404));
  }
  req.appointment = appointment;
  next();
});
