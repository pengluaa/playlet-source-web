import { useImperativeHandle, useState, forwardRef } from 'react';
import { Form, Input, InputNumber, Modal, Space, message } from 'antd';
import UploadFile from '@/components/UploadFile';
import ProjectSelect from './_projectSelect';

import { submit as submitSv } from './service';

interface Props {
  onOk?: () => void;
}

const CreateForm = forwardRef((props: Props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState<boolean>();

  const [form] = Form.useForm();

  const submit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      values.version = values.version.join('.');
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
    values.version = values.version.split('.');
    form.setFieldsValue(values);
  };

  useImperativeHandle<any, ModalFormRef>(ref, () => ({
    add: () => {
      setTitle('新增');
      setOpen(true);
    },
    view(values) {
      setTitle('详情');
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
      onCancel={onCancel}
      onOk={submit}
    >
      <Form form={form} wrapperCol={{ span: 16 }} labelCol={{ span: 5 }}>
        <Form.Item label="项目" name="projectId" rules={[{ required: true }]}>
          <ProjectSelect showDir />
        </Form.Item>
        <Form.Item label="版本号" required style={{ marginBottom: 0 }}>
          <Space size={2}>
            <Form.Item
              name={['version', 0]}
              rules={[{ required: true, message: '请输入主版本号' }]}
            >
              <InputNumber min={0} precision={0} placeholder="主版本号" />
            </Form.Item>

            <Form.Item
              name={['version', 1]}
              rules={[{ required: true, message: '请输入次版本号' }]}
            >
              <InputNumber min={0} precision={0} placeholder="次版本号" />
            </Form.Item>
            <Form.Item
              name={['version', 2]}
              rules={[{ required: true, message: '请输入修订版本号' }]}
            >
              <InputNumber min={0} precision={0} placeholder="修订号" />
            </Form.Item>
            <Form.Item name={['version', 3]}>
              <InputNumber min={0} precision={0} placeholder="分支号" />
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="版本描述" name="description">
          <Input.TextArea rows={2} placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="压缩文件"
          name="filePath"
          tooltip="上传zip压缩包"
          rules={[{ required: true }]}
        >
          <UploadFile dir="deploy" accept=".zip" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreateForm;
