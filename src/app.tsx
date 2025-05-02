import { IRoute, history } from 'umi';

import { getToken, logout, setMenus } from './common';
import { getUserMenu as getUserMenuSv } from './service';

export const patchRoutes = ({ routes }: IRoute) => {
  // setRoutes(Object.values(routes));
};

export const render = async (oldRender: Function) => {
  const pathname = window.location.pathname;
  const loginPage = '/login';
  try {
    if (!getToken()) {
      logout();
      oldRender();
      return;
    }
    // 有token时访问登录，跳转到首页
    if (pathname === loginPage) {
      history.replace('/');
    }
    const res = await getUserMenuSv();
    setMenus(res.data ?? []);
    oldRender();
  } catch (error) {
    oldRender();
  }
};
