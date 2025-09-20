import request from '@/utils/request';

export const getList = (params: any) => {
  return request<any[]>({
    url: '/system/server/list',
    params,
  });
};

export const submit = (data: any) => {
  if (data.id) {
    return request({ url: '/system/server/update', method: 'post', data });
  }
  return request({ url: '/system/server/add', method: 'post', data });
};

export const del = (id: number) => {
  return request({
    url: '/system/server/del',
    method: 'delete',
    data: { id },
  });
};

export const refreshStatus = (id: number) => {
  return request({
    url: '/system/server/status',
    method: 'post',
    data: { id },
  });
};
