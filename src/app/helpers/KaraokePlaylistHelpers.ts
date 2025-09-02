import {logger} from '../configs/LoggerConfig';
import {EStatusPlaylist} from '../enums/DateEnum';
import {IKaraokePlaylistTblQueryOutput} from '../models/repository_models/KaraokePlaylistTblRepositoryModel';
import {KaraokePlaylistTblRepository} from '../repositories/KaraokePlaylistRepository';

// rearrange sequence karaoke playlist
const reArrangeSequenceHelper = async (
  rentalId: number,
): Promise<IKaraokePlaylistTblQueryOutput[]> => {
  const playlist = await KaraokePlaylistTblRepository.findAll({
    q: {rental_id: rentalId, status: EStatusPlaylist.Queue},
    orderBy: {column: 'sequence', direction: 'asc'},
  });

  playlist.forEach((item, index) => {
    item.sequence = index + 1;
  });

  // update karaokePlaylist
  await Promise.all(
    playlist.map((itemPlaylist, i) =>
      KaraokePlaylistTblRepository.update(
        {sequence: i + 1} as IKaraokePlaylistTblQueryOutput,
        {q: {id: itemPlaylist.id}},
      ),
    ),
  );

  return playlist;
};

const setPlayingHelper = async (rentalId: number): Promise<boolean> => {
  // get playlist tbl
  const karaokePlaylist = await KaraokePlaylistTblRepository.findOne({
    q: {rental_id: rentalId, status: EStatusPlaylist.Queue},
    orderBy: {column: 'sequence', direction: 'asc'},
  });

  if (!karaokePlaylist) {
    logger.error('Playlist not in queue');
    return false;
  }

  // update playlist
  const updatedPlaylist = {
    status: EStatusPlaylist.Playing,
  } as IKaraokePlaylistTblQueryOutput;

  try {
    await KaraokePlaylistTblRepository.update(updatedPlaylist, {
      q: {id: karaokePlaylist.id},
    });
  } catch (error) {
    logger.error('Error updating playlist:', error);
    return false;
  }

  return true;
};

const setPlayedHelper = async (rentalId: number): Promise<boolean> => {
  // get playlist tbl
  const karaokePlaylist = await KaraokePlaylistTblRepository.findOne({
    q: {rental_id: rentalId, status: EStatusPlaylist.Playing},
    orderBy: {column: 'sequence', direction: 'asc'},
  });

  if (!karaokePlaylist) {
    logger.error('Playlist not in queue');
    return false;
  }

  // update playlist
  const updatedPlaylist = {
    status: EStatusPlaylist.Played,
  } as IKaraokePlaylistTblQueryOutput;

  try {
    await KaraokePlaylistTblRepository.update(updatedPlaylist, {
      q: {id: karaokePlaylist.id},
    });
  } catch (error) {
    logger.error('Error updating playlist:', error);
    return false;
  }

  return true;
};

const setStoppedHelper = async (rentalId: number): Promise<boolean> => {
  // get playlist tbl
  const karaokePlaylist = await KaraokePlaylistTblRepository.findOne({
    q: {rental_id: rentalId, status: EStatusPlaylist.Playing},
    orderBy: {column: 'sequence', direction: 'asc'},
  });

  if (!karaokePlaylist) {
    logger.error('Playlist not in queue');
    return false;
  }

  // update playlist
  const updatedPlaylist = {
    status: EStatusPlaylist.Stopped,
  } as IKaraokePlaylistTblQueryOutput;

  try {
    await KaraokePlaylistTblRepository.update(updatedPlaylist, {
      q: {id: karaokePlaylist.id},
    });
  } catch (error) {
    logger.error('Error updating playlist:', error);
    return false;
  }

  return true;
};

const switchUpSequenceHelper = async (
  karaokePlaylistId: number,
): Promise<boolean> => {
  // get playlist tbl
  const karaokePlaylistMoveUp = await KaraokePlaylistTblRepository.findOne({
    q: {id: karaokePlaylistId},
  });

  if (!karaokePlaylistMoveUp) {
    logger.error('Playlist not found');
    return false;
  }

  if (karaokePlaylistMoveUp.sequence === 1) {
    logger.error('Cannot switch up sequence for first item');
    return false;
  }
  const oldSequence = karaokePlaylistMoveUp.sequence;
  const newSequence = karaokePlaylistMoveUp.sequence - 1;

  //get all karaoke playlists
  const karaokePlaylists = await KaraokePlaylistTblRepository.findAll({
    q: {
      rental_id: karaokePlaylistMoveUp.rental_id,
      status: EStatusPlaylist.Queue,
    },
    orderBy: {column: 'sequence', direction: 'asc'},
  });

  // update sequence for other playlists
  const karaokePlayListMoveDown = karaokePlaylists.find(
    itemPlaylist => itemPlaylist.sequence === newSequence,
  );

  if (!karaokePlayListMoveDown) {
    logger.error('Playlist not found');
    return false;
  }

  // update playlist
  const updatedPlaylistMoveUp = {
    sequence: newSequence,
  } as IKaraokePlaylistTblQueryOutput;
  const updatedPlaylistMoveDown = {
    sequence: oldSequence,
  } as IKaraokePlaylistTblQueryOutput;

  try {
    await Promise.all([
      KaraokePlaylistTblRepository.update(updatedPlaylistMoveUp, {
        q: {id: karaokePlaylistMoveUp.id},
      }),
      KaraokePlaylistTblRepository.update(updatedPlaylistMoveDown, {
        q: {id: karaokePlayListMoveDown.id},
      }),
    ]);
  } catch (error) {
    logger.error('Error updating playlist:', error);
    return false;
  }

  return true;
};

const switchDownSequenceHelper = async (
  karaokePlaylistId: number,
): Promise<boolean> => {
  // get playlist tbl
  const karaokePlaylistMoveDown = await KaraokePlaylistTblRepository.findOne({
    q: {id: karaokePlaylistId},
  });

  if (!karaokePlaylistMoveDown) {
    logger.error('Playlist not found');
    return false;
  }

  //get all karaoke playlists
  const karaokePlaylists = await KaraokePlaylistTblRepository.findAll({
    q: {
      rental_id: karaokePlaylistMoveDown.rental_id,
      status: EStatusPlaylist.Queue,
    },
    orderBy: {column: 'sequence', direction: 'asc'},
  });

  if (karaokePlaylistMoveDown.sequence === karaokePlaylists.length) {
    logger.error('Cannot switch down sequence for last item');
    return false;
  }
  const oldSequence = karaokePlaylistMoveDown.sequence;
  const newSequence = karaokePlaylistMoveDown.sequence + 1;

  // update sequence for other playlists
  const karaokePlayListMoveUp = karaokePlaylists.find(
    itemPlaylist => itemPlaylist.sequence === newSequence,
  );

  if (!karaokePlayListMoveUp) {
    logger.error('Playlist not found');
    return false;
  }

  // update playlist
  const updatedPlaylistMoveDown = {
    sequence: newSequence,
  } as IKaraokePlaylistTblQueryOutput;
  const updatedPlaylistMoveUp = {
    sequence: oldSequence,
  } as IKaraokePlaylistTblQueryOutput;

  try {
    await Promise.all([
      KaraokePlaylistTblRepository.update(updatedPlaylistMoveDown, {
        q: {id: karaokePlaylistMoveDown.id},
      }),
      KaraokePlaylistTblRepository.update(updatedPlaylistMoveUp, {
        q: {id: karaokePlayListMoveUp.id},
      }),
    ]);
  } catch (error) {
    logger.error('Error updating playlist:', error);
    return false;
  }

  return true;
};

//set sequence top first
const switchTopSequenceHelper = async (
  karaokePlaylistId: number,
): Promise<boolean> => {
  // get playlist tbl
  const karaokePlaylistMoveTop = await KaraokePlaylistTblRepository.findOne({
    q: {id: karaokePlaylistId},
  });

  if (!karaokePlaylistMoveTop) {
    logger.error('Playlist not found');
    return false;
  }

  if (karaokePlaylistMoveTop.sequence === 1) {
    logger.error('Cannot switch up sequence for first item');
    return false;
  }
  const newSequence = 1;

  //get all karaoke playlists
  const karaokePlaylists = await KaraokePlaylistTblRepository.findAll({
    q: {
      rental_id: karaokePlaylistMoveTop.rental_id,
      status: EStatusPlaylist.Queue,
    },
    orderBy: {column: 'sequence', direction: 'asc'},
  });

  // update sequence for other playlists
  const takeOutKaraokePlaylistId = karaokePlaylists.filter(
    itemPlaylist => itemPlaylist.id !== karaokePlaylistId,
  );

  let sequenceCounter = 2;
  for (let index = 0; index < takeOutKaraokePlaylistId.length; index++) {
    const itemPlaylist = takeOutKaraokePlaylistId[index];

    const updatedPlaylist = {
      sequence: sequenceCounter,
    } as IKaraokePlaylistTblQueryOutput;

    await KaraokePlaylistTblRepository.update(updatedPlaylist, {
      q: {id: itemPlaylist.id},
    });
    sequenceCounter++;
  }

  // update playlist
  const updatedPlaylistMoveTop = {
    sequence: newSequence,
  } as IKaraokePlaylistTblQueryOutput;

  try {
    await KaraokePlaylistTblRepository.update(updatedPlaylistMoveTop, {
      q: {id: karaokePlaylistMoveTop.id},
    });
  } catch (error) {
    logger.error('Error updating playlist:', error);
    return false;
  }

  return true;
};

const switchBottomSequenceHelper = async (
  karaokePlaylistId: number,
): Promise<boolean> => {
  // get playlist tbl
  const karaokePlaylistMoveBottom = await KaraokePlaylistTblRepository.findOne({
    q: {id: karaokePlaylistId},
  });

  if (!karaokePlaylistMoveBottom) {
    logger.error('Playlist not found');
    return false;
  }

  //get all karaoke playlists
  const karaokePlaylists = await KaraokePlaylistTblRepository.findAll({
    q: {
      rental_id: karaokePlaylistMoveBottom.rental_id,
      status: EStatusPlaylist.Queue,
    },
    orderBy: {column: 'sequence', direction: 'asc'},
  });

  if (karaokePlaylistMoveBottom.sequence === karaokePlaylists.length) {
    logger.error('Cannot switch down sequence for last item');
    return false;
  }
  const newSequence = karaokePlaylists.length;

  // update sequence for other playlists
  const takeOutKaraokePlaylistId = karaokePlaylists.filter(
    itemPlaylist => itemPlaylist.id !== karaokePlaylistId,
  );

  let sequenceCounter = 1;
  for (let index = 0; index < takeOutKaraokePlaylistId.length; index++) {
    const itemPlaylist = takeOutKaraokePlaylistId[index];

    const updatedPlaylist = {
      sequence: sequenceCounter,
    } as IKaraokePlaylistTblQueryOutput;

    await KaraokePlaylistTblRepository.update(updatedPlaylist, {
      q: {id: itemPlaylist.id},
    });
    sequenceCounter++;
  }

  // update playlist
  const updatedPlaylistMoveBottom = {
    sequence: newSequence,
  } as IKaraokePlaylistTblQueryOutput;

  try {
    await KaraokePlaylistTblRepository.update(updatedPlaylistMoveBottom, {
      q: {id: karaokePlaylistMoveBottom.id},
    });
  } catch (error) {
    logger.error('Error updating playlist:', error);
    return false;
  }

  return true;
};

export {
  reArrangeSequenceHelper,
  setPlayingHelper,
  setPlayedHelper,
  setStoppedHelper,
  switchUpSequenceHelper,
  switchDownSequenceHelper,
  switchTopSequenceHelper,
  switchBottomSequenceHelper,
};
