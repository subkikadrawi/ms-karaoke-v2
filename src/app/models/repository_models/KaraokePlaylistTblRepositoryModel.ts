import {IRepositoryParam} from '../../repositories/IRepository';

interface IKaraokePlaylistTbl {
  id?: number;
  rental_id: number;
  sequence: number;
  music_id: number;
  source_karaoke: string;
  music_title: string;
  music_path_url: string;
  music_path_url_vocal: string;
  music_path_url_instrumental: string;
  status: string;
  created_at?: string;
  created_by?: number;
}

type ColumnNames = '*' | keyof IKaraokePlaylistTblQueryOutput;
interface IKaraokePlaylistTblQueryParams extends IRepositoryParam<ColumnNames> {
  q?: {
    id?: number;
    status?: string;
    rental_id?: number;
  };
}

interface IKaraokePlaylistTblQueryOutput extends IKaraokePlaylistTbl {
  total_data?: number;
}

interface IKaraokePlaylistTblInsertQuery extends IKaraokePlaylistTbl {}

interface IKaraokePlaylistTblUpdatedQuery
  extends Partial<IKaraokePlaylistTbl> {}

export {
  IKaraokePlaylistTbl,
  IKaraokePlaylistTblQueryParams,
  IKaraokePlaylistTblQueryOutput,
  IKaraokePlaylistTblUpdatedQuery,
  IKaraokePlaylistTblInsertQuery,
};
