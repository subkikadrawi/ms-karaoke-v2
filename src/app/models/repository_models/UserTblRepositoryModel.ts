import {IRepositoryParam} from '../../repositories/IRepository';

interface IUserTbl {
  id: number;
  login: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  image_url?: string;
  branch_id?: number;
  activated?: boolean;
  created_by?: string;
  created_date?: string;
  last_modified_by?: string;
  last_modified_date?: string;
}

type ColumnNames = '*' | keyof IUserTblQueryOutput;
interface IUserTblQueryParams extends IRepositoryParam<ColumnNames> {
  q?: {
    id?: number;
    login?: string;
  };
}

interface IUserTblQueryOutput extends IUserTbl {
  total_data?: number;
}

interface IUserTblInsertQuery extends IUserTbl {}

interface IUserTblUpdatedQuery extends Partial<IUserTbl> {}

export {
  IUserTbl,
  IUserTblQueryParams,
  IUserTblQueryOutput,
  IUserTblUpdatedQuery,
  IUserTblInsertQuery,
};
