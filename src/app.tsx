import { Button, Modal } from 'antd';
import { history, defineApp } from 'umi';

import { getToken, setUserInfo, setMenus, setRoutes, logout } from './common';
import {
  getUserMenu as getUserMenuSv,
  getUserInfo as getUserInfoSv,
} from './service';

const handleOpenPageError = () => {
  Modal.confirm({
    type: 'warning',
    title: '页面打开失败,请刷新页面',
    okText: '刷新',
    footer() {
      return (
        <Button
          type="primary"
          onClick={() => {
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }}
        >
          刷新
        </Button>
      );
    },
  });
};

const getUserInfo = async (): Promise<UserInfo | undefined> => {
  const token = getToken();
  if (!token) return;
  const { error, data, code } = await getUserInfoSv();
  if (code === -1) {
    handleOpenPageError();
  }
  if (error) return;
  return data;
};

export default defineApp({
  async render(oldRender) {
    const pathname = window.location.pathname;
    const LOGIN_PAGE = '/login';
    const isLogin = !!getToken();
    const userInfo = await getUserInfo();
    setUserInfo(userInfo);
    try {
      if (!isLogin) {
        logout();
        oldRender();
        return;
      }
      // 已登录未获取到用户信息
      if (isLogin && !userInfo) {
        oldRender();
        return;
      }
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
