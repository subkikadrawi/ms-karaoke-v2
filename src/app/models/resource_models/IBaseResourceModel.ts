import {EHttpResponseStatus} from '../../enums/HttpResponseEnum';

interface IBaseResourceModel {
  data?: IBasePaginationModel | any;
  requestId?: string;
  message: string;
  timestamp?: string;
  status: EHttpResponseStatus | number;
  isSuccess: boolean;
}

interface IBasePaginationModel {
  items?: any[];
  totalData: number;
  page: number;
  totalPage: number;
  size: number;
}

export {IBaseResourceModel, IBasePaginationModel};
