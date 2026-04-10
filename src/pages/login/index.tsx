import { useState, useEffect } from 'react';
import { Form, Space, Button, Modal, Input, message } from 'antd';
import md5 from 'blueimp-md5';

import {
  UserOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
} from '@ant-design/icons';

import {
  login as loginSv,
  getCaptcha as getCaptchaSv,
  login2FA as login2FASv,
} from '@/service';
import { setToken } from '@/common';
import { getQueryString } from '@/utils/util';

import styles from './index.less';
import { history } from 'umi';

const Login = () => {
  const [loading, setLoading] = useState<boolean>();
  const [loading2, setLoading2] = useState<boolean>(false);
  const [open2FA, setOpen2FA] = useState<boolean>(false);
  const [captchaId, setCaptchaId] = useState<string>();
  const [captchaImage, setCaptchaImage] = useState<string>();

  const [form] = Form.useForm();
  const [form2FA] = Form.useForm();

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
        password: md5(values.password + PWD_SALT),
        captchaId: captchaId,
      });
      setLoading(false);
      if (error) {
        getCaptcha();
        return;
      }
      const { token, user } = data;
      // 待激活
      if (user.status === 'INACTIVE') {
        setToken(token);
        history.push('/2fa');
        return;
      }
      form2FA.resetFields();
      form2FA.setFieldValue('token', token);
      setOpen2FA(true);
    } catch (error) {
      setLoading(false);
    }
  };

  const verifyBy2FA = async () => {
    try {
      const values = await form2FA.validateFields();
      setLoading2(true);
      const { error, data } = await login2FASv(values);
      setLoading2(false);
      if (error) return;
      message.success('登录成功');
      setToken(data.token);
      setOpen2FA(false);
      toHome();
    } catch (error) {
      // ..
    }
  };

  useEffect(() => {
    getCaptcha();
  }, []);

  return (
    <>
      <div className={styles.login}>
        <div className={styles.header}></div>
        <div className={styles.footer}></div>
        <div className={styles.contain}>
          <h1>账号登录</h1>
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
                autoFocus
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
      {/* 2fa认证 */}
      <Modal
        title="2FA认证"
        width={450}
        destroyOnHidden
        mask={{ closable: false }}
        open={open2FA}
        okButtonProps={{ loading: loading2 }}
        okText="验证"
        onCancel={() => setOpen2FA(false)}
        onOk={verifyBy2FA}
      >
        <Form layout="vertical" form={form2FA}>
          <Form.Item label="token" name="token" hidden>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="输入应用程序生成的 6 位数代码"
            name="code"
            rules={[{ required: true }]}
          >
            <Input autoFocus placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Login;
