import React, { useContext, useEffect, useState } from 'react';
import {
  Space,
  Button,
  Dropdown,
  DropDownProps,
  PopconfirmProps,
  Popconfirm,
} from 'antd';
import type { GetProp, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { hasPermission } from '@/components/Permission';
import { preventDefault } from '@/utils/event';
import styles from './style.less';
import MainContext from '@/mainContext';

export interface TableMoreButtonProps {
  id: number;
  text: string;
  hidden?: boolean;
  disabled?: boolean;
  permisson?: PermissionType;
  popconfirm?: boolean;
  popconfirmProps?: PopconfirmProps;
  onClick?: () => void;
}

interface TableMoreProps {
  buttons: TableMoreButtonProps[];
  max?: number; // 2
  moreText?: string;
  trigger?: GetProp<DropDownProps, 'trigger'>;
}

const TableMoreButton = (props: { button: TableMoreButtonProps }) => {
  const { button } = props;
  const { popconfirmProps } = button;
  const showPopConfirm = button.popconfirm;
  if (showPopConfirm) {
    return (
      <Popconfirm title={popconfirmProps?.title} {...popconfirmProps}>
        <Button
          type="link"
          disabled={button.disabled}
          onClick={() => button.onClick?.()}
        >
          {button.text}
        </Button>
      </Popconfirm>
    );
  }
  return (
    <Button
      type="link"
      disabled={button.disabled}
      onClick={() => button.onClick?.()}
    >
      {button.text}
    </Button>
  );
};

const TableMore: React.FC<TableMoreProps> = (props) => {
  const { max = 2 } = props;
  const [buttons, setButtons] = useState<TableMoreButtonProps[]>();
  const [items, setItems] = useState<MenuProps['items']>([]);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [popconfirmOpen, setPopconfirmOpen] = useState<boolean>(false);
  const [popconfirmProps, setPopconfirmProps] = useState<PopconfirmProps>();
  const { permissons } = useContext(MainContext);

  const onDropDownClick: MenuProps['onClick'] = ({ key }) => {
    const button = props.buttons?.find((item) => item.id === +key);
    button?.onClick?.();
    if (button?.popconfirm) {
      setPopconfirmProps(button.popconfirmProps);
      setPopconfirmOpen(true);
    }
  };

  const getPermissionButtons = async () => {
    const buttons = props.buttons.filter((item) => !item.hidden);
    const permissonButtons: TableMoreButtonProps[] = [];
    for (let i = 0; i < buttons.length; i++) {
      const item = buttons[i];
      if (!item.permisson || hasPermission(item.permisson, permissons)) {
        permissonButtons.push(item);
      }
    }
    return permissonButtons;
  };

  const initButton = async () => {
    const permissonButtons = await getPermissionButtons();
    const buttons: TableMoreButtonProps[] = permissonButtons.splice(0, max);
    const items: MenuProps['items'] = [];

    // 如果只剩下一个按钮（不展示更多下拉菜单）
    if (permissonButtons.length === 1) {
      buttons.push(...permissonButtons.splice(0, 1));
    }

    permissonButtons?.forEach((item) => {
      items.push({
        key: item.id,
        label: item.text,
      });
      items.push({ type: 'divider' });
    });
    items.pop();

    setButtons(buttons);
    setItems(items);
    setShowMore(!!items.length);
  };

  useEffect(() => {
    initButton();
  }, [props.buttons]);

  return (
    <Space style={{ width: '100%', justifyContent: 'center' }} size={10}>
      {/* 显示按钮 */}
      <Space className={styles.tableButton} direction="horizontal" size={10}>
        {buttons?.map((item) => (
          <TableMoreButton key={item.id} button={item} />
        ))}
      </Space>
      {/* 下拉菜单按钮 */}
      {showMore && (
        <Dropdown
          destroyPopupOnHide
          menu={{ items, onClick: onDropDownClick }}
          trigger={props.trigger}
        >
          <Popconfirm
            open={popconfirmOpen}
            title={popconfirmProps?.title}
            {...popconfirmProps}
            onOpenChange={(vis) => !vis && setPopconfirmOpen(vis)}
          >
            <a onClick={(e) => preventDefault(e, true)}>
              <Space size={2}>
                {props.moreText ?? '更多'}
                <DownOutlined style={{ fontSize: 10 }} />
              </Space>
            </a>
          </Popconfirm>
        </Dropdown>
      )}
    </Space>
  );
};

export default TableMore;
