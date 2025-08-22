import request from '@/utils/request';

export const getList = (params: any) => {
  return request<any[]>({
    url: '/cert/list',
    params,
  });
};

export const submit = (data: any) => {
  if (data.id) {
    return request({ url: '/cert/update', method: 'post', data });
  }
  return request({ url: '/cert/add', method: 'post', data });
};

export const del = (id: string) => {
  return request({
    url: '/cert/del',
    method: 'post',
    data: { id },
  });
};