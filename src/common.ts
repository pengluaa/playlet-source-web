import { history } from 'umi';
import dayjs from 'dayjs';
import md5 from 'blueimp-md5';
import CryptoJS from 'crypto-js';

import { logout as logoutSv } from '@/service';
import { getStorage, setStorage } from './utils/storage';
import { getRandomString } from './utils/util';

const AES_decrypt = CryptoJS.AES.decrypt;
const encUtf8 = CryptoJS.enc.Utf8;
const TOKEN_KEY = 'TOKEN';
const USER_INFO_KEY = 'USER_INFO';

export const globalData: GlobalData = {
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

export const setRoutes = (routes: string[]) => {
  globalData.routes = routes;
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
      return item;
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

const tokenKey = AES_decrypt(
  'U2FsdGVkX18x60AcSULZO/pa4QSN74COM5CgeK5Azuo=',
  '',
).toString(encUtf8);

const trKey = AES_decrypt(
  'U2FsdGVkX1+/AWTnD/Zg1Okf9GmVsnMgdigvXJDVEbE=',
  '',
).toString(encUtf8);

const signKey = AES_decrypt(
  'U2FsdGVkX19qpQ31yHY3wngS8EG8SKVDC/Isq4gcFW0=',
  '',
).toString(encUtf8);

export const signSalt = AES_decrypt(
  'U2FsdGVkX1+SpuP6wCUJXVv78PuX2a+neunRrO4dajUyFsKPVnsACG/ekO11wGDv',
  '',
).toString(encUtf8);

// 获取请求头参数
export const getRequestHeader = (url: string = ''): ReqHeader => {
  const tr = [dayjs().unix().toString(), getRandomString(8)].join(':');
  const index = url?.indexOf('?');
  if (index !== -1) {
    url = url.substring(0, index);
  }
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  return {
    [tokenKey]: getToken(),
    [trKey]: tr,
    [signKey]: md5(url + signSalt + tr),
  } as any;
};
/** 检查是否有权限 */
export const checkAuth = (pathname?: string): boolean => {
  if (!pathname || pathname === '/') return true;
  return globalData.menus.some((item) => item.route === pathname);
};

/** 检查是否404 */
export const checkNotFound = (pathname: string): boolean => {
  return !globalData.routes.includes(pathname);
};
