import request from '@/utils/request';

export const getList = (params: any) => {
  return request<any[]>({
    url: '/deploy/review/list',
    params,
  });
};

export const check = (data: {
  id: number;
  pass: boolean;
  rejectReason: string;
}) => {
  return request({
    url: '/deploy/review/check',
    method: 'post',
    data: data,
  });
};
