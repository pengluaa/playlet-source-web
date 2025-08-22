import request from '@/utils/request';

export const getConf = () => {
  return request<any[]>({
    url: '/cert/conf',
  });
};

export const submit = (data: any) => {
  return request({ url: '/cert/save_conf', method: 'post', data });
};
