import express from 'express';
import * as controller from '../../app/https/controllers/KaraokeMusicControllers';
import {authMiddleware} from '../../app/https/middleware/AuthMiddleware';

const router = express.Router();

router.get('/', authMiddleware, controller.getList);
router.get('/:category/:title_music', controller.getMusicVideo);
router.get(
  '/:category/separated/:title_music/:type_file',
  controller.getMusicInstrument,
);

export {router as musicsRouter};
