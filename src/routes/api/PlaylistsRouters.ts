import express from 'express';
import * as controller from '../../app/https/controllers/KaraokePlaylistControllers';
import {authMiddleware} from '../../app/https/middleware/AuthMiddleware';

const router = express.Router();

router.get('/', authMiddleware, controller.getList);
router.post('/', authMiddleware, controller.addPlaylist);
router.post('/set-playing', authMiddleware, controller.setPlaying);
router.post('/set-played', authMiddleware, controller.setPlayed);
router.post('/set-next', authMiddleware, controller.setNext);
router.post('/:id', authMiddleware, controller.updatePlaylist);
router.post('/move-up/:playlistId', authMiddleware, controller.setSequenceUp);
router.post(
  '/move-down/:playlistId',
  authMiddleware,
  controller.setSequenceDown,
);
router.post('/move-top/:playlistId', authMiddleware, controller.setSequenceTop);
router.post(
  '/move-bottom/:playlistId',
  authMiddleware,
  controller.setSequenceBottom,
);

export {router as playlistsRouter};
