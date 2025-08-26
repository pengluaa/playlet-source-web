
import { message } from 'antd';
import axios, { isAxiosError, Method } from 'axios';

import { getRequestHeader } from '../common';
import { logout } from '../common';

type ResultCode = number;
interface ServerResponse<T = any> {
  code: number;
  message?: string;
  data?: T;
}

interface RequestOptins {
  url?: string;
  method?: Method;
  data?: any;
  params?: any;
  showErrMsg?: boolean;
}

export const SUCCESS_CODE: ResultCode = 0;
export const UNAUTHORIZED: ResultCode = 40001;
const TIMEOUT = 60e3; // time out
const DEFAULT_ERR_TEXT = '请求发生错误'; // err text

const instance = axios.create({
  baseURL: BASE_API,
  timeout: TIMEOUT,
  responseType: 'json',
});

instance.interceptors.request.use(function (config) {
  const headers: any = getRequestHeader(config.url);
  for (const key in headers) {
    config.headers.set(key, headers[key]);
  }
  return config;
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const response = error?.response || {};
    let msg = DEFAULT_ERR_TEXT;
    if (isAxiosError(error)) {
      msg = error.message;
    }
    response.status = response.status ?? -1;
    response.data = {
      code: -1,
      message: msg,
      data: null,
    } as ServerResponse;
    return response;
  },
);

// 老接口请求适配
export const requestAdapter = <T = any>(
  url: string,
  options?: RequestOptins,
) => {
  return request<T>({
    ...options,
    url,
  });
};

export default async function request<T = any>(
  opts: RequestOptins,
): Promise<ResponseOk<T> | ResponseErr> {
  const res = await instance<ServerResponse>({
    method: opts.method,
    url: opts.url,
    data: opts.data,
    params: opts.params,
  });
  const response = res.data;
  if (res.status === 200 && response.code === SUCCESS_CODE) {
    return {
      error: false,
      code: response?.code,
      msg: response?.message,
      data: response?.data,
    } as ResponseOk<T>;
  }  
  if (response?.message && opts?.showErrMsg !== false) {
    message.error(response.message);
  }
  if (response.code === UNAUTHORIZED) {
    logout();
  }
  return {
    error: true,
    code: response?.code || res.status,
    msg: response?.message,
    data: null,
  } as ResponseErr;
}
