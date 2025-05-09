import request from '@/utils/request';

export const getList = (params: any) => {
  return request<any[]>({
    url: '/resource/video_subset/list',
    params: params,
  });
};

export const reFormat = (id: number) => {
  return request<boolean>({
    method: 'post',
    url: '/resource/video_subset/re_format',
    data: { id },
  });
};
