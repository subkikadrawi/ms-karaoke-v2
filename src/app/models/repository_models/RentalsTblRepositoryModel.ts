import {IRepositoryParam} from '../../repositories/IRepository';

interface IRentalsTbl {
  id?: number;
  branch_id?: number;
  rental_item_id: number;
  user_id: number;
  customer_name: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: string;
  payment_status: string;
  has_transaction?: boolean;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

type ColumnNames = '*' | keyof IRentalsTblQueryOutput;
interface IRentalsTblQueryParams extends IRepositoryParam<ColumnNames> {
  q?: {
    id?: number;
    user_id?: number;
    status?: string;
    payment_status?: string;
    has_transaction?: boolean;
    isBetweenStartAndEndTime?: boolean;
  };
}

interface IRentalsTblQueryOutput extends IRentalsTbl {
  total_data?: number;
}

interface IRentalsTblInsertQuery extends IRentalsTbl {}

interface IRentalsTblUpdatedQuery extends Partial<IRentalsTbl> {}

export {
  IRentalsTbl,
  IRentalsTblQueryParams,
  IRentalsTblQueryOutput,
  IRentalsTblUpdatedQuery,
  IRentalsTblInsertQuery,
};
