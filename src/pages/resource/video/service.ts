import request from '@/utils/request';

export const getList = (params: any) => {
  return request<any[]>({
    url: '/resource/video/list',
    params,
  });
};

export const submit = (data: any) => {
  if (data.id) {
    return request({ url: '/resource/video/update', method: 'post', data });
  }
  return request({ url: '/resource/video/add', method: 'post', data });
};

export const del = (id: string) => {
  return request({
    url: '/resource/video/del',
    method: 'post',
    data: { id },
  });
};
