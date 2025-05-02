import { requestAdapter as request } from '@/utils/request';

export const getList = (params: any) => {
  return request('/system/user/list', { params });
};

export const submit = (data: any) => {
  if (data.id) {
    return request('/system/user/update', { method: 'post', data });
  }
  return request('/system/user/add', { method: 'post', data });
};

export const del = (id: string) => {
  return request('/system/user/del', { method: 'delete', data: { id } });
};
