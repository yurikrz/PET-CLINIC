import { AppError } from '../../common/errors/appError.js';
import { catchAsync } from '../../common/errors/catchAsync.js';
import {
  encryptedPassword,
  verifyPassword,
} from '../../config/plugins/encrypted-password.plugin.js';
import { generateJWT } from '../../config/plugins/generate-jwt.plugin.js';
import {
  validateLogin,
  validatePartialUser,
  validateUpdateUserPassword,
  validateUser,
} from './user.schema.js';
import { UserService } from './user.service.js';
import { UploadFile } from '../../common/utils/upload-files-cloud.js';
import { generateUUID } from '../../config/plugins/generate-uudi.plugin.js';

export const register = catchAsync(async (req, res, next) => {
  const { hasError, errorMessage, userData } = validateUser(req.body);

  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessage,
    });
  }

  const path = `user/${generateUUID()}-${req.file.originalname}`;
  const photoURL = await UploadFile.uploadToFireBase(path, req.file.buffer);

  userData.photo = photoURL;

  const user = await UserService.create(userData);
  const token = await generateJWT(user.id);

  return res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      birthdate: user.birthdate,
      photo: user.photo,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  //1. traer los datos de la req.body y validar
  const { hasError, errorMessage, userData } = validateLogin(req.body);
  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessage,
    });
  }

  //2. validar que el usuario exista en la BD
  const user = await UserService.findOneByEmail(userData.email);

  if (!user) {
    return next(new AppError('This account does not exist', 404));
  }

  //3. comparar y comprobar password
  const isCorrectPassword = await verifyPassword(
    userData.password,
    user.password
  );

  if (!isCorrectPassword) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //4. generar JWT
  const token = await generateJWT(user.id);

  //5. enviar la respuesta al cliente
  return res.status(200).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      birthdate: user.birthdate,
    },
  });
});

export const findAllUser = catchAsync(async (req, res, next) => {
  const users = await UserService.findAll();
  return res.status(201).json(users);
});

export const findOneUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  return res.status(200).json(user);
});

export const updateUser = catchAsync(async (req, res, next) => {
  const { hasError, errorMessage, userData } = validatePartialUser(req.body);
  const { user } = req;

  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessage,
    });
  }

  const userUpdated = await UserService.update(user, userData);
  return res.status(200).json(userUpdated);
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  await UserService.delete(user);
  return res.status(204).json(null);
});

export const changePassword = catchAsync(async (req, res, next) => {
  //1. obtener el usuario en sesion
  const { sessionUser } = req;

  //2. Traer los datos del req.body
  const { hasError, errorMessage, userData } = validateUpdateUserPassword(
    req.body
  );

  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessage,
    });
  }

  //const { currentPassword, newPassword } = req.body;

  //3. Validar si la contraseña actual y la nueva
  if (userData.currentPassword === userData.newPassword) {
    return next(new AppError('The password cannot be equal', 400));
  }

  //4. Validar si la contraseña actual es igual a la contraseña de BD
  const isCorrectPassword = await verifyPassword(
    userData.currentPassword,
    sessionUser.password
  );

  if (!isCorrectPassword) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //5. encriptar nueva contraseña
  const hashedNewPassword = await encryptedPassword(userData.newPassword);

  //6. Actualizar la contraseña en la BD
  await UserService.update(sessionUser, {
    password: hashedNewPassword,
    passwordChangedAt: new Date(),
  });

  return res.status(200).json({
    message: 'User password was updated successfully',
  });
});
