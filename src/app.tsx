import { history, defineApp } from 'umi';

import { getToken, logout, setMenus, setRoutes } from './common';
import { getUserMenu as getUserMenuSv } from './service';

export default defineApp({
  async render(oldRender) {
    const pathname = window.location.pathname;
    const LOGIN_PAGE = '/login';
    try {
      if (!getToken()) {
        logout();
        oldRender();
        return;
      }
      // 有token时访问登录，跳转到首页
      if (pathname === LOGIN_PAGE) {
        history.replace('/');
      }
      const res = await getUserMenuSv();
      setMenus(res.data ?? []);
      oldRender();
    } catch (error) {
      oldRender();
    }
  },

  patchClientRoutes({ routes }) {
    const routePaths: string[] = routes[0].routes.map(
      (item: { path: string }) =>
        ['/', '*'].includes(item.path) ? item.path : '/' + item.path,
    );
    setRoutes(routePaths);
  },
});
