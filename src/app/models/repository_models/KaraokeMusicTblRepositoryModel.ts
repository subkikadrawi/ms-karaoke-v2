import {IRepositoryParam} from '../../repositories/IRepository';
interface IKaraokeMusicTbl {
  id: number;
  branchId: number;
  categoryId: number;
  title?: string;
  pathUrl: string;
  pathUrlImage: string;
  pathUrlVocal: string;
  pathUrlInstrumental: string;
  sourceKaraoke: string;
  created_at: string;
  update_at?: string | null;
  created_by?: number;
  update_by?: number | null;
  status?: number;
}

type ColumnNames = '*' | keyof IKaraokeMusicTblQueryOutput;
interface IKaraokeMusicTblQueryParams extends IRepositoryParam<ColumnNames> {
  q?: {
    id?: number;
    title?: string;
    categoryId?: number;
  };
}

interface IKaraokeMusicTblQueryOutput extends IKaraokeMusicTbl {
  total_data?: number;
}

interface IKaraokeMusicTblInsertQuery extends IKaraokeMusicTbl {}

interface IKaraokeMusicTblUpdatedQuery extends Partial<IKaraokeMusicTbl> {}

export {
  IKaraokeMusicTbl,
  IKaraokeMusicTblQueryParams,
  IKaraokeMusicTblQueryOutput,
  IKaraokeMusicTblUpdatedQuery,
  IKaraokeMusicTblInsertQuery,
};
