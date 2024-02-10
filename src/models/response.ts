export interface ApiResponseType<T> {
  status: boolean;
  data: T;
  message: string;
  functionname: string;
}
