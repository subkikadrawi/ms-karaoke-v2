import express from 'express';
import * as controller from '../../app/https/controllers/AuthControllers';

const router = express.Router();

router.use('/login', controller.login);

export {router as authRouter};
