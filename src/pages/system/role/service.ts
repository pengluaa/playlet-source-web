import { requestAdapter as request } from '@/utils/request';

// 角色列表
export const getList = (params: any) => {
  return request('/system/role/list', { params });
};

// 提交角色
export const submit = (data: any) => {
  if (data.id) {
    return request('/system/role/update', { method: 'post', data });
  }
  return request('/system/role/add', { method: 'post', data });
};

// 角色授权
export const auth = (data: number[]) => {
  return request('/system/role/auth', { method: 'post', data });
};

// 角色详情
export const getAuthIds = (id: number) => {
  return request<any[]>('/system/role/auth_id', { params: { id } });
};

// 删除角色
export const del = (id: string) => {
  return request('/system/role/del', { method: 'delete', data: { id } });
};
