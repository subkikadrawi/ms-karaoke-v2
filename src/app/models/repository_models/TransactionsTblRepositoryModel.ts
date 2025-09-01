import {IRepositoryParam} from '../../repositories/IRepository';

interface ITransactionsTbl {
  id: number;
  invoice_number: string;
  branch_id: number;
  rental_id: number;
  user_id: number;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  transaction_type: string;
  customer_id: number;
  created_at: string;
  updated_at: string;
}

type ColumnNames = '*' | keyof ITransactionsTblQueryOutput;
interface ITransactionsTblQueryParams extends IRepositoryParam<ColumnNames> {
  q?: {
    id?: number;
  };
}

interface ITransactionsTblQueryOutput extends ITransactionsTbl {
  total_data?: number;
}

interface ITransactionsTblInsertQuery extends ITransactionsTbl {}

interface ITransactionsTblUpdatedQuery extends Partial<ITransactionsTbl> {}

export {
  ITransactionsTbl,
  ITransactionsTblQueryParams,
  ITransactionsTblQueryOutput,
  ITransactionsTblUpdatedQuery,
  ITransactionsTblInsertQuery,
};
