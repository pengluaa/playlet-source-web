import { requestAdapter as request } from '@/utils/request';

export const getList = (params: any) => {
  return request<any[]>('/resource/source/list', { params });
};

export const submit = (data: any) => {
  if (data.id) {
    return request('/resource/source/update', { method: 'post', data });
  }
  return request('/resource/source/add', { method: 'post', data });
};

export const del = (id: string) => {
  return request(`/resource/source/del`, { method: 'post', data: { id } });
};

export const getSubset = (id: number) => {
  return request<any[]>('/resource/source/subset', { params: { id } });
};

export const saveSubset = (data: any) => {
  return request<any>('/resource/source/save_subset', {
    method: 'post',
    data,
  });
};
