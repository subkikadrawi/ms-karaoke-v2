import express from 'express';
import {authRouter} from './AuthRouters';
import {musicsRouter} from './MusicsRouters';
import {playlistsRouter} from './PlaylistsRouters';
import {rentalRouter} from './RentalRouters';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/musics', musicsRouter);
router.use('/playlists', playlistsRouter);
router.use('/rentals', rentalRouter);

export {router as apiRouter};
