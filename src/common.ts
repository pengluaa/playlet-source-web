import { IRoute, history } from 'umi';
import moment from 'dayjs';
import md5 from 'blueimp-md5';

import { logout as logoutSv } from '@/service';
import { getStorage, setStorage } from './utils/storage';

const TOKEN_KEY = 'TOKEN';
const USER_INFO_KEY = 'USER_INFO';

const globalData: GlobalData = {
  TOKEN: getStorage(TOKEN_KEY) || '',
  menus: [],
  routes: [],
};

export const getMenus = () => {
  return globalData.menus;
};

export const setMenus = (menus: MenuItem[]) => {
  globalData.menus = menus;
};

export const setToken = (token: string): void => {
  setStorage(TOKEN_KEY, token);
  globalData.TOKEN = token;
};

export const setUserInfo = (user: UserInfo) => {
  setStorage(USER_INFO_KEY, user);
};

export const getUserInfo = () => {
  return getStorage<UserInfo>(USER_INFO_KEY);
};

export const getCurrentMenu = (pathname?: string): MenuItem | null => {
  const menus = globalData.menus;
  pathname = pathname || location.pathname;
  for (let i = 0; i < menus.length; i++) {
    const item = menus[i];
    if (item.route === pathname) {
      return item
    }
  }
  return null;
};

export const logout = async (server?: boolean) => {
  try {
    if (server) {
      await logoutSv();
    }
    setToken('');
    if (['/', '/login'].some((v) => location.pathname === v)) {
      history.push('/login');
      return;
    }
    history.push(`/login?uri=${encodeURIComponent(document.URL)}`);
  } catch (error) {
    // ..
  }
};

export const getToken = (): string => {
  return globalData.TOKEN;
};

// 获取请求头参数
export const getRequestHeader = (): ReqHeader => {
  const timestamp = moment().unix().toString();
  return {
    token: globalData.TOKEN,
    timestamp,
    sign: md5('8K5DJIZGMTWOOEPT' + timestamp),
  };
};

export default globalData;
