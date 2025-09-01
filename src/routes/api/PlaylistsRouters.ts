import express from 'express';
import * as controller from '../../app/https/controllers/KaraokePlaylistControllers';
import {authMiddleware} from '../../app/https/middleware/AuthMiddleware';

const router = express.Router();

router.get('/', authMiddleware, controller.getList);
router.post('/', authMiddleware, controller.addPlaylist);
router.post('/:id', authMiddleware, controller.updatePlaylist);

export {router as playlistsRouter};
