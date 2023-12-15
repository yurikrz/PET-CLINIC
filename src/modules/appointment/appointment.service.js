import Appointment from './appointment.model.js';
import { Op, QueryTypes } from 'sequelize';
import { sequelize } from '../../config/database/database.js';
import moment from 'moment-timezone';
import Pet from '../pet/pet.model.js';
import Medic from '../medic/medic.model.js';
import User from '../user/user.model.js';

export class AppointmentService {
  static async create(data) {
    return await Appointment.create(data);
  }

  static async findAppointmentByTime(medicId, durationMinutes = 30, startTime) {
    return await Appointment.findOne({
      where: {
        medicId,
        status: 'pending',
        startTime: {
          [Op.between]: [
            new Date(startTime),
            new Date(startTime).getTime() + durationMinutes * 60000,
          ],
        },
      },
    });
  }

  static async findAppointmentByTimeSQL(
    medicId,
    durationMinutes = 30,
    startTime
  ) {
    const databaseTimeZone = 'US/Eastern';
    const startMoment = moment(startTime).tz(databaseTimeZone);
    const endMoment = startMoment.clone().add(durationMinutes, 'minutes');

    const exactMatchAppointments = await sequelize.query(
      'SELECT * FROM appointments WHERE status=:status and medic_id=:medicId and start_time=:startTime',
      {
        type: QueryTypes.SELECT,
        replacements: {
          status: 'pending',
          medicId: medicId,
          startTime: startMoment.toISOString(),
        },
      }
    );

    if (exactMatchAppointments.length >= 1) {
      return exactMatchAppointments;
    }

    const overlappingAppointments = await sequelize.query(
      "SELECT * FROM appointments WHERE medic_id = :medicId AND status = :status AND start_time < :endTime AND start_time + INTERVAL '30 minutes' > :startTime",
      {
        type: QueryTypes.SELECT,
        replacements: {
          status: 'pending',
          medicId: medicId,
          endTime: endMoment.toISOString(),
          startTime: startMoment.toISOString(),
        },
      }
    );
    return overlappingAppointments;
  }

  static async findOne(id) {
    return await Appointment.findOne({
      where: {
        id,
        status: 'pending',
      },
    });
  }

  static async findAll() {
    return await Appointment.findAll({
      where: {
        status: 'pending',
      },
      include: [
        {
          model: Pet,
          include: [
            {
              model: User,
              attributes: ['dni', 'surname', 'name'],
            },
          ],
        },
        {
          model: Medic,
          attributes: ['dni', 'surname', 'name', 'speciality'],
        },
      ],
    });
  }

  static async update(appointment) {
    return await appointment.update({
      status: 'completed',
    });
  }

  static async delete(appointment) {
    return await appointment.update({
      status: 'cancelled',
    });
  }
}
