import z from 'zod';
import { extractValidationData } from '../../common/utils/extractErrorData.js';

export const petSchema = z.object({
  name: z.string().min(3).max(80),
  birthdate: z.string(),
  specie: z.string().min(3).max(60),
  race: z.string().min(3).max(60),
  userId: z.number(),
});

export const validatePet = (data) => {
  const result = petSchema.safeParse(data);
  const {
    hasError,
    errorMessage,
    data: petData,
  } = extractValidationData(result);

  return {
    hasError,
    errorMessage,
    petData,
  };
};

export const validatePartialPet = (data) => {
  const result = petSchema.partial().safeParse(data);
  const {
    hasError,
    errorMessage,
    data: petData,
  } = extractValidationData(result);

  return {
    hasError,
    errorMessage,
    petData,
  };
};
