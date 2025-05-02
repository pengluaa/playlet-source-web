import { useState, useEffect } from 'react';
import { Form, Space, Button, Modal, Input } from 'antd';
import md5 from 'blueimp-md5';

import {
  UserOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
} from '@ant-design/icons';

import { login as loginSv, getCaptcha as getCaptchaSv } from '@/service';
import { setToken, setUserInfo } from '@/common';
import { getQueryString } from '@/utils/util';

import styles from './index.less';

const Login = () => {
  const [loading, setLoading] = useState<boolean>();
  const [captchaId, setCaptchaId] = useState<string>();
  const [captchaImage, setCaptchaImage] = useState<string>();

  const [form] = Form.useForm();

  const getCaptcha = async () => {
    setCaptchaId('');
    setCaptchaImage('');
    form.setFieldValue('code', null);
    const { error, data } = await getCaptchaSv();
    if (error) return;
    setCaptchaId(data.captchaId);
    setCaptchaImage(data.image);
  };

  const toHome = () => {
    const uri = getQueryString('uri');
    location.replace(decodeURIComponent(uri) || '/');
  };

  const login = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const { error, data } = await loginSv({
        ...values,
        password: md5(values.password),
        captchaId: captchaId,
      });
      setLoading(false);
      if (error) {
        getCaptcha();
        return;
      }
      const { account, username, id, remind } = data;
      setToken(data.token);
      setUserInfo({
        id: id,
        account: account,
        username: username,
      });
      if (!!remind) {
        Modal.info({
          title: '提示',
          content: remind,
          okText: '知道了',
          onOk() {
            toHome();
          },
        });
      } else {
        toHome();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCaptcha();
  }, []);

  return (
    <div className={styles.login}>
      <div className={styles.header}></div>
      <div className={styles.footer}></div>
      <div className={styles.contain}>
        <h1>平台管理中心</h1>
        <Form className={styles.form} form={form}>
          <p className={styles.title}>登录</p>
          <Form.Item
            name="account"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入账号"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="off"
            />
          </Form.Item>
          <Space size={14} style={{ width: '100%' }} align="start">
            <Form.Item
              name="code"
              rules={[{ required: true, message: '请输入计算结果' }]}
            >
              <Input
                prefix={<SafetyCertificateOutlined />}
                placeholder="请输入计算结果"
                autoComplete="off"
              />
            </Form.Item>

            {captchaId && (
              <img
                src={captchaImage}
                alt=""
                style={{ height: 40 }}
                onClick={getCaptcha}
              />
            )}
          </Space>

          <Form.Item noStyle>
            <Button
              block
              type="primary"
              htmlType="submit"
              style={{ marginTop: 40 }}
              loading={loading}
              onClick={login}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
