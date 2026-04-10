import request from '@/utils/request';

export const getProjects = () => {
  return request<{ id: number; name: string; dir: string; folder?: string }[]>({
    url: '/deploy/upload/projects',
  });
};

export const getList = (params: any) => {
  return request<any[]>({
    url: '/deploy/upload/list',
    params,
  });
};

export const submit = (data: any) => {
  if (data.id) {
    return request({ url: '/deploy/upload/update', method: 'post', data });
  }
  return request({ url: '/deploy/upload/add', method: 'post', data });
};

export const del = (id: number) => {
  return request({
    url: '/deploy/upload/del',
    method: 'delete',
    data: { id },
  });
};

export const redeploy = (id: number) => {
  return request({
    url: '/deploy/upload/redeploy',
    method: 'post',
    data: { id },
  });
};
