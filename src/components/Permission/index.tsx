import React, { useContext, useEffect, useState } from 'react';
import { getCurrentMenu, getMenus } from '@/common';
import MainContext from '@/mainContext';

interface PermissionProps {
  type: PermissionType;
}
// 菜单权限map
const permissionMap = new Map<string, PermissionType[]>();

const getPermission = (permissionsButtons: MenuItem[]): PermissionType[] => {
  const pathname = location.pathname;
  if (permissionMap.has(pathname)) {
    return permissionMap.get(pathname) as PermissionType[];
  }
  const currentMenu = getCurrentMenu(pathname);
  if (!currentMenu) {
    permissionMap.set(pathname, []);
    return [];
  }
  const permissions = permissionsButtons
    .filter((menu) => currentMenu.id === menu.pid)
    .map((item) => item.permission)
    .filter((item) => !!item);
  permissionMap.set(pathname, permissions);
  return permissions;
};

export const hasPermission = (
  type: PermissionType,
  permissionsButtons: MenuItem[],
): boolean => {
  if (!type) {
    return true;
  }
  const permissons = getPermission(permissionsButtons);
  return permissons.includes(type);
};

type PermissionFc = React.FC<React.PropsWithChildren<PermissionProps>>;
const Permission: PermissionFc = (props) => {
  const { permissons } = useContext(MainContext);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setShow(hasPermission(props.type, permissons));
  }, [permissons]);

  return show ? props.children : <></>;
};

export default Permission;
