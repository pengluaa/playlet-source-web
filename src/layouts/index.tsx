import React, { useEffect, useMemo, useState } from 'react';
import { ConfigProvider, Layout as AntdLaoyout } from 'antd';
import { Outlet, useLocation } from 'umi';
import dayjs from 'dayjs';
import locale from 'antd/locale/zh_CN';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

import UnauthorizedPage from '@/pages/403';
import NotFoundPage from '@/pages/404';
import SideBar from './SideBar';
import Header from './Header';
import styles from './index.less';
import themes from '../themes/var';
import GlobalContext from '@/mainContext';
import { getUserInfo, checkAuth, checkNotFound } from '@/common';
import {
  getPermisson as getPermissonSv,
  getFormats as getFormatsSv,
  getChannels as getChannelsSv,
} from '@/service';
import 'dayjs/locale/zh-cn';

dayjs.extend(weekday);
dayjs.extend(localeData);

const { Content: AntdContent } = AntdLaoyout;

const Content = () => {
  const [globalData, setGlobalData] = useState<MainContextValue>({
    userInfo: getUserInfo(),
    permissons: [],
    formats: [],
    channels: [],
  });
  const location = useLocation();
  const pathname = location.pathname;
  const authorized = useMemo<boolean>(() => checkAuth(pathname), [pathname]);
  const notFound = useMemo<boolean>(() => checkNotFound(pathname), [pathname]);
  
  const getPermisson = async () => {
    const { error, data } = await getPermissonSv();
    if (error) return;
    globalData.permissons = data;
    setGlobalData(Object.assign({}, globalData));
  };

  const getFormats = async () => {
    const { error, data } = await getFormatsSv();
    if (error) return;
    globalData.formats = data;
    setGlobalData(Object.assign({}, globalData));
  };

  const getChannels = async () => {
    const { error, data } = await getChannelsSv();
    if (error) return;
    globalData.channels = data;
    setGlobalData(Object.assign({}, globalData));
  };

  useEffect(() => {
    getPermisson();
    getFormats();
    getChannels();
  }, []);
  if (['/login'].includes(pathname)) {
    return <Outlet />;
  }

  return (
    <GlobalContext.Provider value={globalData}>
      <AntdLaoyout className={styles.container}>
        <Header />
        <AntdLaoyout>
          <SideBar />
          <AntdContent>
            <div id="main-content" className={styles.content}>
              {authorized ? (
                <Outlet />
              ) : notFound ? (
                <NotFoundPage />
              ) : (
                <UnauthorizedPage />
              )}
            </div>
          </AntdContent>
        </AntdLaoyout>
      </AntdLaoyout>
    </GlobalContext.Provider>
  );
};
export default function Layout() {
  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: themes['@primary-color'],
        },
      }}
    >
      <Content />
    </ConfigProvider>
  );
}
