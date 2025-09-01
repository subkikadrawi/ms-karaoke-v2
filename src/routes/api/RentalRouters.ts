import express from 'express';
import * as controller from '../../app/https/controllers/RentalControllers';
import {authMiddleware} from '../../app/https/middleware/AuthMiddleware';

const router = express.Router();

// router.get('/', authMiddleware, controller.getList);
router.post('/', authMiddleware, controller.addRental);

export {router as rentalRouter};
