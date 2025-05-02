import React, { useEffect, useState } from 'react';
import { ConfigProvider, Layout } from 'antd';
import { Outlet, useLocation } from 'umi';
import dayjs from 'dayjs';
import locale from 'antd/locale/zh_CN';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

import SideBar from './SideBar';
import Header from './Header';
import styles from './index.less';
import themes from '../themes/var';
import GlobalContext from '@/mainContext';
import { getPermisson as getPermissonSv } from '@/service';

import 'dayjs/locale/zh-cn';
import { getUserInfo } from '@/common';

dayjs.extend(weekday);
dayjs.extend(localeData);

const { Content } = Layout;

const GContent = () => {
  const [globalData, setGlobalData] = useState<MainContextValue>({
    userInfo: getUserInfo(),
    permissons: [],
  });
  const location = useLocation();
  const pathname = location.pathname;

  const getPermisson = async () => {
    const { error, data } = await getPermissonSv();
    if (error) return;
    globalData.permissons = data;
    setGlobalData(Object.assign({}, globalData));
  };

  useEffect(() => {
    getPermisson();
  }, []);

  if (['/login', '/workspace'].includes(pathname)) {
    return <Outlet />;
  }

  return (
    <GlobalContext.Provider value={globalData}>
      <Layout className={styles.container}>
        <Header />
        <Layout>
          <SideBar />
          <Content>
            <div id="main-content" className={styles.content}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </GlobalContext.Provider>
  );
};
export default function GLayout() {
  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: themes['@primary-color'],
        },
      }}
    >
      <GContent />
    </ConfigProvider>
  );
}
