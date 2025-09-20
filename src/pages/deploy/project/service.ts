import request from '@/utils/request';

interface Server {
  id: number;
  name: string;
  status: string;
}

export const getServers = () => {
  return request<Server[]>({
    url: '/deploy/project/servers',
  });
};

export const getList = (params: any) => {
  return request({
    url: '/deploy/project/list',
    params,
  });
};

export const getHistorys = (params: any) => {
  return request({
    url: '/deploy/project/historys',
    params,
  });
};

export const rollback = (itemId: number) => {
  return request({
    method: 'post',
    url: '/deploy/project/rollback',
    data: { itemId },
  });
};

export const submit = (data: any) => {
  if (data.id) {
    return request({ url: '/deploy/project/update', method: 'post', data });
  }
  return request({ url: '/deploy/project/add', method: 'post', data });
};

export const del = (id: number) => {
  return request({
    url: '/deploy/project/del',
    method: 'delete',
    data: { id },
  });
};
