import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, message, Switch } from 'antd';
import PageHeader from '@/components/PageHeader';

import { getConf as getConfSv, submit as submitSv } from './service';

const Config = () => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  const getConf = async () => {
    setLoading(true);
    const { error, data } = await getConfSv();
    setLoading(false);
    if (data) {
      form.setFieldsValue(data);
    }
  };

  const submit = async (values: unknown) => {
    setSubmitLoading(true);
    const { error, data } = await submitSv(values);
    setSubmitLoading(false);
    if (error) return;

    message.success('提交成功');
  };

  useEffect(() => {
    getConf();
  }, []);

  return (
    <>
      <PageHeader title="配置管理" />
      <Card loading={loading}>
        <Form
          style={{ maxWidth: 450 }}
          form={form}
          labelCol={{ span: 6 }}
          onFinish={submit}
        >
          <Form.Item
            label="打开通知"
            name="open"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Form.Item label="通知邮箱" name="email" tooltip="不填写则不发送邮箱">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="过期通知"
            name="advance"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={1}
              addonBefore="过期前"
              addonAfter="天"
              placeholder="请输入"
            />
          </Form.Item>
          <Form.Item label={null} wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default Config;
