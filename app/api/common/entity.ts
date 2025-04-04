/**
 * API响应接口
 */
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface CommonMessage {
  code: number;
  message: string;
}

export interface ListResponse<T> {
  list: T[];
  total: number;
}

export interface BaseRequest {
  token: string;
}
