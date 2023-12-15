import { AppError } from '../../common/errors/appError.js';
import { catchAsync } from '../../common/errors/catchAsync.js';
import { MedicService } from '../medic/medic.service.js';
import { PetService } from '../pet/pet.service.js';
import { validateAppointment } from './appointment.schema.js';
import { AppointmentService } from './appointment.service.js';

export const findAllAppointments = catchAsync(async (req, res, next) => {
  const appointments = await AppointmentService.findAll();
  return res.status(200).json(appointments);
});

export const scheduleAppointment = catchAsync(async (req, res, next) => {
  const { hasError, errorMessage, appointmentData } = validateAppointment(
    req.body
  );
  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessage,
    });
  }

  const [pet, medic] = await Promise.all([
    await PetService.findOne(appointmentData.petId),
    await MedicService.findOne(appointmentData.medicId),
  ]);

  if (!pet) {
    return next(
      new AppError(`Pet with id ${appointmentData.petId} not found!.`, 404)
    );
  }

  if (!medic) {
    return next(
      new AppError(`Medic with id ${appointmentData.medicId} not found!.`, 404)
    );
  }

  const appointments = await AppointmentService.findAppointmentByTimeSQL(
    appointmentData.medicId,
    req.body.durationMinutes,
    appointmentData.startTime
  );

  if (appointments.length >= 1) {
    return next(
      new AppError(
        `Medict with id ${appointmentData.medicId} has schedule an appointment at this time.`,
        404
      )
    );
  }

  const appointment = await AppointmentService.create(appointmentData);
  return res.status(200).json(appointment);
});

export const findOneAppointment = catchAsync(async (req, res, next) => {
  const { appointment } = req;
  return res.status(200).json(appointment);
});

export const updateAppointment = catchAsync(async (req, res, next) => {
  const { appointment } = req;
  //NO Deberia completar una cita que este cancelada
  await AppointmentService.update(appointment);
  return res
    .status(204)
    .json({ message: 'The appointment has been completed' });
});

export const deleteAppointment = catchAsync(async (req, res, next) => {
  const { appointment } = req;
  //NO se deberia poder cancelar una cita completada
  //Solo se puede cancelar una cita con 1 hora previa a la cita
  await AppointmentService.delete(appointment);
  return res.status(204).json(null);
});
