import z from 'zod';
import { extractValidationData } from '../../common/utils/extractErrorData.js';

const medicSchema = z.object({
  dni: z.string().min(16).max(20),
  name: z.string().min(3).max(60),
  surname: z.string().min(3).max(60),
  speciality: z.array(z.string()),
});

export const validateMedic = (data) => {
  const result = medicSchema.safeParse(data);
  const {
    hasError,
    errorMessage,
    data: medicData,
  } = extractValidationData(result);

  return {
    hasError,
    errorMessage,
    medicData,
  };
};

export const validatePartialMedic = (data) => {
  const result = medicSchema.partial().safeParse(data);
  const {
    hasError,
    errorMessage,
    data: medicData,
  } = extractValidationData(result);

  return {
    hasError,
    errorMessage,
    medicData,
  };
};
