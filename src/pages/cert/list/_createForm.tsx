import { useImperativeHandle, useState, forwardRef } from 'react';
import { Form, Input, Modal, Space, message } from 'antd';

import { submit as submitSv } from './service';

interface Props {
  onOk?: () => void;
}

const CreateForm = forwardRef((props: Props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState<boolean>();

  const [form] = Form.useForm();

  const submit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      const { error } = await submitSv(values);
      setSubmitLoading(false);

      if (error) return;
      message.success('提交成功');
      onCancel();
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
    add: () => {
      setTitle('新增');
      setOpen(true);
      setView(false);
    },
    edit: (values) => {
      setTitle('编辑');
      setOpen(true);
      setView(false);
      setFormValues(values);
    },
    view(values) {
      setTitle('详情');
      setView(true);
      setOpen(true);
      setFormValues(values);
    },
  }));

  return (
    <Modal
      title={title}
      confirmLoading={submitLoading}
      width={600}
      open={open}
      okButtonProps={{ style: { display: view ? 'none' : undefined } }}
      onCancel={onCancel}
      onOk={submit}
    >
      <Form
        form={form}
        disabled={view}
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 4 }}
      >
        <Form.Item label="id" name="id" hidden>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="域名"
          name="domain"
          tooltip="example.com，example.com:8887"
          rules={[{ required: true }]}
        >
          <Space.Compact>
            <Space.Addon>https://</Space.Addon>
            <Input placeholder="请输入" />
          </Space.Compact>
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreateForm;
