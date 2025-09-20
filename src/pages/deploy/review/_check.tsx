import { useImperativeHandle, useState, forwardRef } from 'react';
import { Form, Input, message, Modal, Radio } from 'antd';
import RenderText from '@/components/Render/Text';

import { check as checkSv } from './service';

interface Props {
  onOk?: () => void;
}

const Check = forwardRef((props: Props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>();

  const [form] = Form.useForm();

  const isReject = Form.useWatch('pass', form) === false;

  const submit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      const { error } = await checkSv(values);
      setSubmitLoading(false);
      if (error) return;
      setOpen(false);
      message.success('审核成功');
      props.onOk?.();
    } catch (error) {
      // ..
    }
  };

  const onCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const setFormValues = (values: any) => {
    values = Object.assign({}, values);
    form.setFieldsValue(values);
  };

  useImperativeHandle<any, ModalFormRef>(ref, () => ({
    edit: (values) => {
      setOpen(true);
      setFormValues(values);
    },
  }));

  return (
    <Modal
      title="审核"
      width={650}
      open={open}
      confirmLoading={submitLoading}
      okText="提交"
      onCancel={onCancel}
      onOk={submit}
    >
      <Form form={form} wrapperCol={{ span: 16 }} labelCol={{ span: 5 }}>
        <Form.Item label="id" name="id" hidden>
          <RenderText />
        </Form.Item>
        <Form.Item
          label="项目名称"
          name={['project', 'name']}
          style={{ marginBottom: 0 }}
        >
          <RenderText />
        </Form.Item>
        <Form.Item
          label="项目路径"
          name={['project', 'dir']}
          style={{ marginBottom: 0 }}
        >
          <RenderText />
        </Form.Item>
        <Form.Item label="版本号" name="version" style={{ marginBottom: 0 }}>
          <RenderText />
        </Form.Item>
        <Form.Item
          label="版本描述"
          name="description"
          style={{ marginBottom: 0 }}
        >
          <RenderText />
        </Form.Item>
        <Form.Item label="文件地址" name="filePath" style={{ marginBottom: 0 }}>
          <RenderText />
        </Form.Item>
        <Form.Item label="文件md5" name="md5" style={{ marginBottom: 0 }}>
          <RenderText />
        </Form.Item>
        <Form.Item label="文件sha256" name="sha256" style={{ marginBottom: 0 }}>
          <RenderText />
        </Form.Item>
        <Form.Item
          label="上传账号"
          name={['user', 'account']}
          style={{ marginBottom: 0 }}
        >
          <RenderText />
        </Form.Item>
        <Form.Item
          label="上传用户名"
          name={['user', 'username']}
          style={{ marginBottom: 0 }}
        >
          <RenderText />
        </Form.Item>
        <Form.Item
          label="上传时间"
          name="createdAt"
          style={{ marginBottom: 0 }}
        >
          <RenderText timeField />
        </Form.Item>
        <Form.Item
          label="状态"
          name="pass"
          initialValue={true}
          rules={[{ required: true }]}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={true}>通过</Radio>
            <Radio value={false}>拒绝</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          hidden={!isReject}
          label="拒绝原因"
          name="rejectReason"
          rules={[{ required: isReject }]}
        >
          <Input.TextArea rows={2} placeholder="请选择" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default Check;
