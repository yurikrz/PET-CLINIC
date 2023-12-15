import { catchAsync } from '../../common/errors/catchAsync.js';
import { UploadFile } from '../../common/utils/upload-files-cloud.js';
import { generateUUID } from '../../config/plugins/generate-uudi.plugin.js';
import { httpClient } from '../../config/plugins/http-client.plugin.js';
import { validatePartialPet, validatePet } from './pet.schema.js';
import { PetService } from './pet.service.js';

export const findAllPets = catchAsync(async (req, res, next) => {
  const pets = await PetService.findAll();
  return res.status(200).json(pets);
});

export const createPet = catchAsync(async (req, res, next) => {
  const dataBody = {
    name: req.body.name,
    birthdate: req.body.birthdate,
    specie: req.body.specie,
    race: req.body.race,
    userId: +req.body.userId,
  };
  const { hasError, errorMessage, petData } = validatePet(dataBody);

  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessage,
    });
  }

  const path = `pet/${generateUUID()}-${req.file.originalname}`;
  const photoURL = await UploadFile.uploadToFireBase(path, req.file.buffer);

  const medicalCardNumber = generateUUID();
  const results = await httpClient.get(
    `http://localhost:3100/api/v1/genetic-diseases?specie=${petData.specie}`
  );

  const diseases = results.geneticDiseases.map((disease) => disease.name);

  petData.medicalCardNumber = medicalCardNumber;
  petData.genetic_diseases = diseases;
  petData.photo = photoURL;

  const pet = await PetService.create(petData);

  return res.status(200).json(pet);
});

export const findOnePet = catchAsync(async (req, res, next) => {
  const { pet } = req;
  return res.status(200).json(pet);
});

export const updatePet = catchAsync(async (req, res, next) => {
  const { hasError, errorMessage, petData } = validatePartialPet(req.body);
  const { pet } = req;
  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessage,
    });
  }

  const petUpdated = await PetService.update(pet, petData);
  return res.status(200).json(petUpdated);
});

export const deletePet = catchAsync(async (req, res, next) => {
  const { pet } = req;
  await PetService.delete(pet);
  return res.status(204).json(null);
});
