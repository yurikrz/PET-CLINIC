import express from 'express';
import {
  deleteUser,
  findAllUser,
  findOneUser,
  login,
  register,
  updateUser,
  changePassword,
} from './user.controller.js';
import {
  protect,
  protectAccountOwner,
  restrictTo,
  validateExistUser,
} from './user.middleware.js';
import { uploadSingle } from '../../config/plugins/upload-files.plugin.js';

export const router = express.Router();

router.post('/register', uploadSingle('photo'), register);

router.post('/login', login);

router.use(protect);

router.patch('/change-password', changePassword);

router.get('/', findAllUser);

//ejecutando middleware para las rutas /:id
//router.use('/:id',validateExistUser)

router
  .route('/:id')
  .get(restrictTo('developer', 'receptionist'), validateExistUser, findOneUser)
  .patch(validateExistUser, protectAccountOwner, updateUser)
  .delete(validateExistUser, protectAccountOwner, deleteUser);
