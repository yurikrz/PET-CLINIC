import z from 'zod';
import { extractValidationData } from '../../common/utils/extractErrorData.js';

const appointmentSchema = z.object({
  startTime: z.string(),
  reason: z.string().min(10),
  petId: z.number(),
  medicId: z.number(),
});

export const validateAppointment = (data) => {
  const result = appointmentSchema.safeParse(data);
  const {
    hasError,
    errorMessage,
    data: appointmentData,
  } = extractValidationData(result);

  return {
    hasError,
    errorMessage,
    appointmentData,
  };
};

export const validatePartialAppointment = (data) => {
  const result = appointmentSchema.partial().safeParse(data);
  const {
    hasError,
    errorMessage,
    data: appointmentData,
  } = extractValidationData(result);

  return {
    hasError,
    errorMessage,
    appointmentData,
  };
};
