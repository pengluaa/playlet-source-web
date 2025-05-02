import React, { useContext, useState } from 'react';
import { Link } from 'umi';
import {
  Popover,
  Drawer,
  Button,
  Form,
  Space,
  Input,
  Image,
  message,
  Flex,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import md5 from 'blueimp-md5';

import Logo from '@/assets/icons/logo.png';
import defaultAvatar from '@/assets/images/default_avatar.png';
import GlobalContext from '@/mainContext';
import { logout } from '@/common';
import { modifyPassword as modifyPasswordSv } from '@/service';
import { validatePassword } from '@/utils/util';
import styles from './header.less';

interface ContentProps {
  onVisible?: (visible: boolean) => void;
}

const Content = (props: ContentProps) => {
  const { onVisible } = props;
  const [loading, setLoading] = useState<boolean>();
  const [visible, setVisible] = useState<boolean>();
  const [form] = Form.useForm();

  const showDrawer = () => {
    form.resetFields();
    setVisible(true);
    onVisible?.(true);
  };

  const modifyPwd = async () => {
    const values = await form.validateFields();
    delete values.confirmPwd;
    values.oldPassword = md5(values.oldPassword);
    values.newPassword = md5(values.newPassword);
    setLoading(true);
    const { error } = await modifyPasswordSv(values);
    logout();
    setLoading(false);
    if (error) return;
    setVisible(false);
    message.success('修改成功');
  };

  return (
    <>
      <Space direction="vertical">
        <Link to="/">
          <Button block type="text">
            首页
          </Button>
        </Link>
        <Button block type="text" onClick={() => showDrawer()}>
          修改密码
        </Button>
        <Button block type="text" onClick={() => logout(true)}>
          安全退出
        </Button>
      </Space>
      <Drawer
        title="修改密码"
        open={visible}
        width={462}
        onClose={() => setVisible(false)}
        extra={
          <Button type="primary" onClick={() => modifyPwd()} loading={loading}>
            提交
          </Button>
        }
      >
        <Form form={form} wrapperCol={{ span: 14 }} labelCol={{ span: 6 }}>
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[{ required: true }]}
          >
            <Input autoComplete="off" placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="新密码"
            hasFeedback
            name="newPassword"
            rules={[
              {
                required: true,
                // validator(rule, value) {
                //   if (!validatePassword(value)) {
                //     return Promise.reject(
                //       '需满足大小写字母+数字组合密码长度大于等于8位',
                //     );
                //   }
                //   return Promise.resolve();
                // },
              },
            ]}
          >
            <Input.Password
              autoComplete="new-password"
              maxLength={20}
              placeholder="请输入"
            />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPwd"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次密码输入不一致'));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="off" placeholder="请输入" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

const Header: React.FC<any> = () => {
  const [visible, setVisible] = useState<boolean>();

  const { userInfo } = useContext(GlobalContext);

  return (
    <header className={styles.header}>
      <Flex justify="space-between" align="center" style={{ width: '100%' }}>
        <Flex align="center" gap={10}>
          <Image src={Logo} preview={false} width={28} />
          <h1 style={{ fontSize: 18, fontWeight: 600 }}>平台管理</h1>
        </Flex>
        <Space size={20}>
          <Popover
            open={visible}
            content={<Content onVisible={() => setVisible(false)} />}
            onOpenChange={setVisible}
          >
            <div className={styles.user}>
              <img src={defaultAvatar}></img>
              <span className={styles.userName}>{userInfo?.username}</span>
              <DownOutlined size={20} />
            </div>
          </Popover>
        </Space>
      </Flex>
    </header>
  );
};

export default Header;
