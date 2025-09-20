import { useImperativeHandle, useState, forwardRef } from 'react';
import { Form, Input, InputNumber, Modal, message } from 'antd';

import { submit as submitSv } from './service';
interface Props {
  onOk?: () => void;
}

const CreateForm = forwardRef((props: Props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [type, setType] = useState<CreateFormType>('add');
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
      setType('add');
    },
    edit: (values) => {
      setTitle('编辑');
      setOpen(true);
      setType('edit');
      setFormValues(values);
    },
    view(values) {
      setTitle('详情');
      setType('view');
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
      okButtonProps={{
        style: { display: type === 'view' ? 'none' : undefined },
      }}
      onCancel={onCancel}
      onOk={submit}
    >
      <Form
        form={form}
        disabled={type === 'view'}
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 4 }}
      >
        <Form.Item label="id" name="id" hidden>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="服务器地址" name="host" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="端口" name="port" rules={[{ required: true }]}>
          <InputNumber placeholder="请输入" min={0} precision={0} />
        </Form.Item>
        <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          hidden={type === 'view'}
          label="密码"
          name="password"
          rules={[{ required: type === 'add' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreateForm;
