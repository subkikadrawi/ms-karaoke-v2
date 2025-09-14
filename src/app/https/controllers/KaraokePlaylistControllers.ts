/* eslint-disable n/no-unsupported-features/node-builtins */
import {ELogStage, logger} from '../../configs/LoggerConfig';
import {
  EHttpResponseStatus,
  EHttpResponseStatusDesc,
} from '../../enums/HttpResponseEnum';
import {IBaseResourceModel} from '../../models/resource_models/IBaseResourceModel';
import {IMainRequest} from '../requests/MainRequest';
import {BaseResource} from '../resources/BaseResource';
import {Response} from 'express';
import {KaraokePlaylistTblRepository} from '../../repositories/KaraokePlaylistRepository';
import {getToken, getUserId} from '../middleware/AuthMiddleware';
import {decodeToken} from '../../configs/JwtConfig';
import {RentalsTblRepository} from '../../repositories/RentalsRepository';
import {IAddPlaylistRequest} from '../requests/IPlaylistRequestRequest';
import moment from 'moment';
import {IKaraokePlaylistTblQueryOutput} from '../../models/repository_models/KaraokePlaylistTblRepositoryModel';
import {EStatusPlaylist} from '../../enums/DateEnum';
import {
  reArrangeSequenceHelper,
  setPlayedHelper,
  setPlayingHelper,
  setStoppedHelper,
  switchBottomSequenceHelper,
  switchDownSequenceHelper,
  switchTopSequenceHelper,
  switchUpSequenceHelper,
} from '../../helpers/KaraokePlaylistHelpers';

const getList = async (req: IMainRequest, res: Response) => {
  logger.info(ELogStage.start);
  const status = (req.query.status ?? '') as string;
  const user_id = getUserId(req);

  // get rentals tbl
  const rental = await RentalsTblRepository.findOne({
    q: {user_id, isBetweenStartAndEndTime: true},
  });

  if (!rental) {
    logger.error('Rental not found');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.NotFound} - Room not found`,
      status: EHttpResponseStatus.NotFound,
    });
  }

  // get playlist tbl
  const karaokePlaylist = await KaraokePlaylistTblRepository.findAll({
    q: {rental_id: rental.id, status},
    orderBy: {column: 'sequence', direction: 'asc'},
  });

  const response: IBaseResourceModel = {
    data: karaokePlaylist,
    isSuccess: true,
    message: '200 OK',
    status: EHttpResponseStatus.OK,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

const addPlaylist = async (
  req: IMainRequest<IAddPlaylistRequest>,
  res: Response,
) => {
  logger.info(ELogStage.start);
  const music_id = req.body.music_id;
  const source_karaoke = req.body.source_karaoke;
  const music_title = req.body.music_title;
  const music_path_url = req.body.music_path_url;
  const music_path_url_vocal = req.body.music_path_url_vocal;
  const music_path_url_instrumental = req.body.music_path_url_instrumental;

  // get token
  const token = getToken(req);

  // get user id from token
  const valueToken = decodeToken(token ?? '');
  if (!valueToken.payload) {
    logger.error('Invalid token payload');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.BadRequest} - Invalid token payload`,
      status: EHttpResponseStatus.BadRequest,
    });
  }
  const user_id = Number(valueToken.payload.sub);

  // get rentals tbl
  const rental = await RentalsTblRepository.findOne({
    q: {user_id, isBetweenStartAndEndTime: true},
  });

  if (!rental) {
    logger.error('Rental not found');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.NotFound} - Rental not found`,
      status: EHttpResponseStatus.NotFound,
    });
  }

  // get playlist last sequence
  const lastPlaylist = await KaraokePlaylistTblRepository.findOne({
    q: {rental_id: rental.id},
    orderBy: {column: 'sequence', direction: 'desc'},
  });

  // create new playlist
  const newPlaylist = {
    rental_id: rental.id ?? 0,
    sequence:
      lastPlaylist === undefined || lastPlaylist.sequence === null
        ? 1
        : (lastPlaylist.sequence ?? 0) + 1,
    status: 'queue',
    music_id: music_id,
    source_karaoke: source_karaoke,
    music_title: music_title,
    music_path_url: music_path_url,
    music_path_url_vocal: music_path_url_vocal,
    music_path_url_instrumental: music_path_url_instrumental,
    created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    created_by: user_id,
  } as IKaraokePlaylistTblQueryOutput;
  try {
    await KaraokePlaylistTblRepository.save(newPlaylist);
  } catch (error) {
    logger.error('Error adding playlist:', error);
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.InternalServerError} - Failed to add playlist`,
      status: EHttpResponseStatus.InternalServerError,
    });
  }

  //reArrange sequence
  await reArrangeSequenceHelper(rental.id ?? 0);

  const response: IBaseResourceModel = {
    isSuccess: true,
    message: 'success add playlist',
    status: EHttpResponseStatus.OK,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

const updatePlaylist = async (req: IMainRequest, res: Response) => {
  const playlistId = Number(req.params.id);
  const status = req.body.status;

  // cek status
  if (!Object.values(EStatusPlaylist).includes(status)) {
    logger.error('Invalid status');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.BadRequest} - Invalid status`,
      status: EHttpResponseStatus.BadRequest,
    });
  }

  // get playlist tbl
  const karaokePlaylist = await KaraokePlaylistTblRepository.findOne({
    q: {id: playlistId},
  });

  if (!karaokePlaylist) {
    logger.error('Playlist not found');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.NotFound} - Playlist not found`,
      status: EHttpResponseStatus.NotFound,
    });
  }

  // update playlist
  const updatedPlaylist = {
    status,
  } as IKaraokePlaylistTblQueryOutput;

  if (status === EStatusPlaylist.Deleted) {
    updatedPlaylist.sequence = 0;
  }

  try {
    await KaraokePlaylistTblRepository.update(updatedPlaylist, {
      q: {id: playlistId},
    });

    // reArrange sequence
    await reArrangeSequenceHelper(karaokePlaylist.rental_id);
  } catch (error) {
    logger.error('Error updating playlist:', error);
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.InternalServerError} - Failed to update playlist`,
      status: EHttpResponseStatus.InternalServerError,
    });
  }

  const response: IBaseResourceModel = {
    isSuccess: true,
    message: 'success update playlist',
    status: EHttpResponseStatus.OK,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

const setPlaying = async (req: IMainRequest, res: Response) => {
  const user_id = getUserId(req);

  // get rentals tbl
  const rental = await RentalsTblRepository.findOne({
    q: {user_id, isBetweenStartAndEndTime: true},
  });

  if (!rental) {
    logger.error('Rental not found');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.NotFound} - Room not found`,
      status: EHttpResponseStatus.NotFound,
    });
  }
  logger.info('Getting rental id from token:', rental.id);

  // get playlist tbl
  const karaokePlaylist = await KaraokePlaylistTblRepository.findOne({
    q: {rental_id: rental.id, status: EStatusPlaylist.Queue},
  });

  if (!karaokePlaylist) {
    logger.error('Playlist not found');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.NotFound} - Playlist not found`,
      status: EHttpResponseStatus.NotFound,
    });
  }
  logger.info('Getting playlist id from token:', karaokePlaylist.id);

  //set playing playlist
  await setPlayingHelper(rental.id ?? 0);

  //reArrange sequence
  await reArrangeSequenceHelper(karaokePlaylist.rental_id);

  const response: IBaseResourceModel = {
    isSuccess: true,
    message: 'success update playlist to playing',
    status: EHttpResponseStatus.OK,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

const setPlayed = async (req: IMainRequest, res: Response) => {
  const user_id = getUserId(req);

  // get rentals tbl
  const rental = await RentalsTblRepository.findOne({
    q: {user_id, isBetweenStartAndEndTime: true},
  });

  if (!rental) {
    logger.error('Rental not found');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.NotFound} - Room not found`,
      status: EHttpResponseStatus.NotFound,
    });
  }

  // get playlist tbl
  const karaokePlaylist = await KaraokePlaylistTblRepository.findOne({
    q: {rental_id: rental.id, status: EStatusPlaylist.Playing},
  });

  if (!karaokePlaylist) {
    logger.error('Playlist not found');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.NotFound} - Playlist not found`,
      status: EHttpResponseStatus.NotFound,
    });
  }

  // update playlist
  await setPlayedHelper(karaokePlaylist.rental_id);

  //reArrange sequence
  await reArrangeSequenceHelper(karaokePlaylist.rental_id);

  const response: IBaseResourceModel = {
    isSuccess: true,
    message: 'success update playlist to played',
    status: EHttpResponseStatus.OK,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

const setNext = async (req: IMainRequest, res: Response) => {
  const user_id = getUserId(req);

  // get rentals tbl
  const rental = await RentalsTblRepository.findOne({
    q: {user_id, isBetweenStartAndEndTime: true},
  });

  if (!rental) {
    logger.error('Rental not found');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.NotFound} - Room not found`,
      status: EHttpResponseStatus.NotFound,
    });
  }

  // get playlist tbl
  const karaokePlaylist = await KaraokePlaylistTblRepository.findOne({
    q: {rental_id: rental.id, status: EStatusPlaylist.Playing},
  });

  if (!karaokePlaylist) {
    //set playing playlist
    await setPlayingHelper(rental.id ?? 0);

    const karaokePlaylist = await KaraokePlaylistTblRepository.findOne({
      q: {rental_id: rental.id, status: EStatusPlaylist.Playing},
    });

    if (!karaokePlaylist) {
      logger.error('Playlist not found');
      return BaseResource.exec(res, {
        isSuccess: false,
        message: `${EHttpResponseStatusDesc.NotFound} - Playlist not found`,
        status: EHttpResponseStatus.NotFound,
      });
    }
    const response: IBaseResourceModel = {
      isSuccess: true,
      message: 'success update playlist to next',
      status: EHttpResponseStatus.OK,
    };
    logger.info(ELogStage.end);
    return BaseResource.exec(res, response);
  }

  //set stopped playlist
  await setStoppedHelper(karaokePlaylist.rental_id);

  //set playing playlist
  await setPlayingHelper(karaokePlaylist.rental_id);

  //reArrange sequence
  await reArrangeSequenceHelper(karaokePlaylist.rental_id);

  const response: IBaseResourceModel = {
    isSuccess: true,
    message: 'success update playlist to next',
    status: EHttpResponseStatus.OK,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

const setNextPlaying = async (req: IMainRequest, res: Response) => {
  const user_id = getUserId(req);

  // get rentals tbl
  const rental = await RentalsTblRepository.findOne({
    q: {user_id, isBetweenStartAndEndTime: true},
  });

  if (!rental) {
    logger.error('Rental not found');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.NotFound} - Room not found`,
      status: EHttpResponseStatus.NotFound,
    });
  }

  // get playlist tbl
  const karaokePlaylist = await KaraokePlaylistTblRepository.findOne({
    q: {rental_id: rental.id, status: EStatusPlaylist.Playing},
  });

  if (!karaokePlaylist) {
    //set playing playlist
    await setPlayingHelper(rental.id ?? 0);

    const karaokePlaylist = await KaraokePlaylistTblRepository.findOne({
      q: {rental_id: rental.id, status: EStatusPlaylist.Playing},
    });

    if (!karaokePlaylist) {
      logger.error('Playlist not found');
      return BaseResource.exec(res, {
        isSuccess: false,
        message: `${EHttpResponseStatusDesc.NotFound} - Playlist not found`,
        status: EHttpResponseStatus.NotFound,
      });
    }
    const response: IBaseResourceModel = {
      isSuccess: true,
      message: 'success update playlist to next',
      status: EHttpResponseStatus.OK,
    };
    logger.info(ELogStage.end);
    return BaseResource.exec(res, response);
  }

  //set played playlist
  await setPlayedHelper(karaokePlaylist.rental_id);

  //set playing playlist
  await setPlayingHelper(karaokePlaylist.rental_id);

  //reArrange sequence
  await reArrangeSequenceHelper(karaokePlaylist.rental_id);

  const response: IBaseResourceModel = {
    isSuccess: true,
    message: 'success update playlist to next',
    status: EHttpResponseStatus.OK,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

//switch sequence up
const setSequenceUp = async (req: IMainRequest, res: Response) => {
  const karaokePlaylistId = Number(req.params.playlistId);

  // switch sequence
  const resultBoolean = await switchUpSequenceHelper(karaokePlaylistId);

  const response: IBaseResourceModel = {
    isSuccess: resultBoolean,
    message: resultBoolean
      ? 'success update playlist to up'
      : 'failed update playlist to up',
    status: 200,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

//switch sequence down
const setSequenceDown = async (req: IMainRequest, res: Response) => {
  const karaokePlaylistId = Number(req.params.playlistId);

  // switch sequence
  const resultBoolean = await switchDownSequenceHelper(karaokePlaylistId);

  const response: IBaseResourceModel = {
    isSuccess: resultBoolean,
    message: resultBoolean
      ? 'success update playlist to down'
      : 'failed update playlist to down',
    status: EHttpResponseStatus.OK,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

const setSequenceTop = async (req: IMainRequest, res: Response) => {
  const karaokePlaylistId = Number(req.params.playlistId);

  // switch sequence
  const resultBoolean = await switchTopSequenceHelper(karaokePlaylistId);

  const response: IBaseResourceModel = {
    isSuccess: resultBoolean,
    message: resultBoolean
      ? 'success update playlist to top'
      : 'failed update playlist to top',
    status: EHttpResponseStatus.OK,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

const setSequenceBottom = async (req: IMainRequest, res: Response) => {
  const karaokePlaylistId = Number(req.params.playlistId);

  // switch sequence
  const resultBoolean = await switchBottomSequenceHelper(karaokePlaylistId);

  const response: IBaseResourceModel = {
    isSuccess: resultBoolean,
    message: resultBoolean
      ? 'success update playlist to bottom'
      : 'failed update playlist to bottom',
    status: EHttpResponseStatus.OK,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

export {
  getList,
  addPlaylist,
  updatePlaylist,
  setPlaying,
  setPlayed,
  setNext,
  setNextPlaying,
  setSequenceUp,
  setSequenceDown,
  setSequenceTop,
  setSequenceBottom,
};
