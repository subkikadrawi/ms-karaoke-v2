import {IRepositoryParam} from '../../repositories/IRepository';

interface IRentalItemsTbl {
  id: number;
  branch_id: number;
  name: string;
  category: string;
  price_per_hour: number;
  status: string;
  room_number: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

type ColumnNames = '*' | keyof IRentalItemsTblQueryOutput;
interface IRentalItemsTblQueryParams extends IRepositoryParam<ColumnNames> {
  q?: {
    id?: number;
  };
}

interface IRentalItemsTblQueryOutput extends IRentalItemsTbl {
  total_data?: number;
}

interface IRentalItemsTblInsertQuery extends IRentalItemsTbl {}

interface IRentalItemsTblUpdatedQuery extends Partial<IRentalItemsTbl> {}

export {
  IRentalItemsTbl,
  IRentalItemsTblQueryParams,
  IRentalItemsTblQueryOutput,
  IRentalItemsTblUpdatedQuery,
  IRentalItemsTblInsertQuery,
};
