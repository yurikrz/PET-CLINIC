import z from 'zod';
import { extractValidationData } from '../../common/utils/extractErrorData.js';

const registerSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Name must be a string',
      required_error: 'Name is required',
    })
    .min(3, { message: 'Name is too short' })
    .max(50, { message: 'Name is too long' }),
  surname: z
    .string()
    .min(3, { message: 'Surname is too short' })
    .max(50, { message: 'Surname is too long' }),
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .max(80, { message: 'Email is too long' }),
  password: z
    .string()
    .min(8, { message: 'Password is too short' })
    .max(16, { message: 'Password is too long' }),
  dni: z
    .string()
    .min(10, { message: 'DNI is too short' })
    .max(16, { message: 'DNI is too long' }),
  genre: z.enum(['male', 'female', 'other']),
  role: z.enum(['receptionist', 'client', 'developer']),
  birthdate: z.string({
    invalid_type_error: 'Birthdate must be a correct format!',
    required_error: 'Birthdate is required!',
  }),
});

const loginUserSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .max(80, { message: 'Email is too long' }),
  password: z
    .string()
    .min(8, { message: 'Password is too short' })
    .max(16, { message: 'Password is too long' }),
});

const updatedUserPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: 'New Password is too short' })
    .max(16, { message: 'New Password is too long' }),
  currentPassword: z.string(),
});

export const validateUser = (data) => {
  const result = registerSchema.safeParse(data);
  const {
    hasError,
    errorMessage,
    data: userData,
  } = extractValidationData(result);

  return {
    hasError,
    errorMessage,
    userData,
  };
};

export const validatePartialUser = (data) => {
  const result = registerSchema.partial().safeParse(data);
  const {
    hasError,
    errorMessage,
    data: userData,
  } = extractValidationData(result);

  return {
    hasError,
    errorMessage,
    userData,
  };
};

export const validateLogin = (data) => {
  const result = loginUserSchema.safeParse(data);
  const {
    hasError,
    errorMessage,
    data: userData,
  } = extractValidationData(result);

  return {
    hasError,
    errorMessage,
    userData,
  };
};

export const validateUpdateUserPassword = (data) => {
  const result = updatedUserPasswordSchema.safeParse(data);
  const {
    hasError,
    errorMessage,
    data: userData,
  } = extractValidationData(result);

  return {
    hasError,
    errorMessage,
    userData,
  };
};
