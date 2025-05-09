/**
 * @description 公共接口
 */
import { requestAdapter as request } from '@/utils/request';

// 退出登录
export const logout = () => {
  return request('/logout', { method: 'post' });
};

// 修改密码
export const modifyPassword = (data: any) => {
  return request('/update_pwd', { method: 'post', data });
};

// 登录
export const login = (data: any) => {
  return request('/login', { method: 'post', data });
};

// 获取站点路由
export const getUserMenu = () => {
  return request('/system/site_menu', { showErrMsg: false });
};

// 获取站点路由
export const getPermisson = () => {
  return request('/system/button_permisson', { showErrMsg: false });
};

// 获取站点路由
export const getCaptcha = () => {
  return request<{ captchaId: string; image: string }>('/captcha', {
    showErrMsg: false,
  });
};
// 获取转码格式
export const getFormats = () => {
  return request<Format[]>('/formats', {
    showErrMsg: false,
  });
};
// 获取渠道
export const getChannels = () => {
  return request<Channel[]>('/channels', {
    showErrMsg: false,
  });
};
