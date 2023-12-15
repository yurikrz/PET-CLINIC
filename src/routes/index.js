import express from 'express';
import { router as userRoute } from './../modules/user/user.route.js';
import { router as petRoute } from '../modules/pet/pet.route.js';
import { router as medicRoute } from '../modules/medic/medic.route.js';
import { router as appointmentRoute } from '../modules/appointment/appointment.route.js';
import { protect } from '../modules/user/user.middleware.js';
export const router = express.Router();

router.use('/users', userRoute);
router.use(protect);
router.use('/pets', petRoute);
router.use('/medics', medicRoute);
router.use('/appointments', appointmentRoute);
