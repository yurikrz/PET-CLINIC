import express from 'express';
import {
  createPet,
  deletePet,
  findAllPets,
  findOnePet,
  updatePet,
} from './pet.controller.js';
import { validExistPet } from './pet.middleware.js';
import { uploadSingle } from '../../config/plugins/upload-files.plugin.js';

export const router = express.Router();

router.route('/').get(findAllPets).post(uploadSingle('photo'), createPet);

router
  .route('/:id')
  .get(validExistPet, findOnePet)
  .patch(validExistPet, updatePet)
  .delete(validExistPet, deletePet);
