import { useEffect, useState } from 'react';
import { Menu, Layout } from 'antd';
import { globalData, getCurrentMenu } from '@/common';
import { history } from 'umi';
import styles from './sideBar.less';

import { buildTree } from '@/utils/util';

const { Sider } = Layout;

export default function SideBar() {
  const [menuTrees, setMenuTrees] = useState<any[]>();
  const [openKeys, setOpenKeys] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>();

  const handleClickMenuItem = ({ key, keyPath }: any) => {
    const curId = +key;
    const curItem = globalData.menus.find((item) => item.id === curId);
    if (!curItem) return;
    if (curItem.route) {
      history.push(curItem.route);
    }
    setOpenKeys(keyPath);
    setSelectedKeys(keyPath);
  };

  const getParentIds = (id: number): number[] => {
    const menus = globalData.menus;
    const parentIds: number[] = [];

    while (id !== 0) {
      const item = menus.find((item) => item.id === id);
      if (!item || item.pid === 0) {
        return parentIds;
      }
      id = item.pid;
      parentIds.push(item.pid);
    }
    return parentIds;
  };

  const checkOpenKeys = () => {
    const currentMenu = getCurrentMenu();
    if (!currentMenu) return;

    const parentIds = getParentIds(currentMenu.pid);
    const keyPath = [currentMenu.id.toString(), currentMenu.pid.toString()];
    keyPath.push(...parentIds.map((id) => id.toString()));
    setOpenKeys(keyPath);
    setSelectedKeys(keyPath);
  };

  const handleMenuDatas = () => {
    setMenuTrees(
      buildTree(
        globalData.menus
          .sort((a, b) => (b.sort ?? 0) - (a.sort ?? 0))
          .filter(item => item.visible)
          .map((item) => ({
            id: item.id,
            pid: item.pid,
            key: item.id,
            label: item.name,
            icon: item.icon ? (
              <i className={['iconfont', item.icon].join(' ')}></i>
            ) : null,
            title: item.name,
          })),
        'id',
        'pid',
      ),
    );
  };

  useEffect(() => {
    checkOpenKeys();
    const unlisten = history.listen(() => {
      checkOpenKeys();
    });
    return () => {
      unlisten();
    };
  }, []);

  useEffect(() => {
    handleMenuDatas();
  }, []);

  return (
    <div className={styles.siderBar}>
      <Sider
        className={styles.sider}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value: boolean) => setCollapsed(value)}
      >
        <Menu
          className={styles.menu}
          theme="light"
          mode="inline"
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          items={menuTrees}
          itemProp="name"
          onClick={handleClickMenuItem}
          onOpenChange={setOpenKeys}
        />
      </Sider>
    </div>
  );
}
