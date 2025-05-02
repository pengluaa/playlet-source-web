import { requestAdapter as request } from '@/utils/request';
import { buildTree } from '@/utils/util';

// 提交菜单
export const submit = (data: any) => {
  if (data.id) {
    return request('/system/menu/update', { method: 'post', data });
  }
  return request('/system/menu/add', { method: 'post', data });
};

// 删除菜单
export const deleteMenu = (id: string) => {
  return request(`/system/menu/del`, { method: 'post', data: { id } });
};

export const getMenuList = () => {
  return request<any[]>('/system/menu/tree');
};

// 菜单树
export const getMenuTree = async () => {
  const { error, data } = await getMenuList();
  if (error) return [];
  return buildTree(data, 'id', 'pid');
};
