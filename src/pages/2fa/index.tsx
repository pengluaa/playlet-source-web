import { Link } from 'umi';
import {
  Button,
  Flex,
  Form,
  Input,
  Typography,
  QRCode,
  message,
  Result,
} from 'antd';
import { useEffect, useState } from 'react';
import request from '@/utils/request';

import { getQueryString } from '@/utils/util';
import { GoHome } from '../404';

export default function () {
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [otpauth, setOtpauth] = useState<string>('');
  const [showErrPage, setShowErrPage] = useState<boolean>(false);

  const toHome = () => {
    const uri = getQueryString('uri');
    location.replace(decodeURIComponent(uri) || '/');
  };

  const getToken = async () => {
    setLoading(true);
    const { error, data, code } = await request({
      method: 'get',
      url: '/otp/secret',
      showErrMsg: false,
    });
    setLoading(false);
    setShowErrPage(code === 30011);
    if (error) return;
    setOtpauth(data.otpauth);
  };

  const verify = async (values: any) => {
    setSubmitLoading(true);
    const { error } = await request({
      method: 'post',
      url: '/otp/verify',
      data: {
        code: values.code,
      },
    });
    setSubmitLoading(false);
    if (error) return;
    message.success('认证成功');
    toHome();
  };

  useEffect(() => {
    getToken();
  }, []);

  if (showErrPage) {
    return (
      <Result
        status='warning'
        title="不能重复认证"
        subTitle="如果已经丢失身份验证，请联系管理员。"
        extra={<GoHome />}
      />
    );
  }
  return (
    <div style={{ maxWidth: 450, margin: 'auto', textAlign: 'center' }}>
      <Typography.Title level={3}>设置双因素身份验证</Typography.Title>
      <Typography.Title level={4}>下载身份验证器应用程序</Typography.Title>

      <Typography.Text type="secondary">
        Android, iOS, and Blackberry - Google Authenticator
      </Typography.Text>
      <Typography.Paragraph type="secondary">
        Windows Phone - Authenticator
      </Typography.Paragraph>
      <Typography.Title level={5}>使用应用程序扫描此代码</Typography.Title>
      <Flex style={{ margin: '20px auto' }} justify="center">
        <QRCode
          status={loading ? 'loading' : 'active'}
          size={170}
          value={otpauth}
        />
      </Flex>
      <Form layout="vertical" onFinish={verify}>
        <Form.Item
          label="输入应用程序生成的 6 位数代码"
          name="code"
          rules={[{ required: true }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item>
          <Button
            block
            htmlType="submit"
            loading={submitLoading}
            type="primary"
          >
            验证
          </Button>
          <div style={{ textAlign: 'start' }}>
            <Link to="/login">回到登录页</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
