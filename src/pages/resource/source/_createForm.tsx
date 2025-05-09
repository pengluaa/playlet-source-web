import { useImperativeHandle, useState, forwardRef } from 'react';
import { Form, Input, InputNumber, Modal, Radio, Switch, message } from 'antd';
import UploadImage from '@/components/UploadImage';
import { submit as submitSv } from './service';

interface Props {
  onOk?: () => void;
}

const CreateForm = forwardRef((props: Props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit,setIsEdit ] = useState<boolean>(false);
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
      setIsEdit(false);
    },
    edit: (values) => {
      setTitle('编辑');
      setOpen(true);
      setIsEdit(true);
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
      <Form
        labelAlign="right"
        form={form}
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 5 }}
      >
        <Form.Item label="id" name="id" hidden>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="资源名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="描述" name="remark">
          <Input.TextArea rows={3} placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="总集数"
          name="episodes"
          tooltip="预告片不计入集数"
          rules={[{ required: true }]}
        >
          <InputNumber disabled={isEdit} min={1} step={1} precision={0} placeholder="请输入" />
        </Form.Item>
        <Form.Item label="封面" name="poster" rules={[{ required: true }]}>
          <UploadImage multiple={false} />
        </Form.Item>
        <Form.Item label="是否有预告片" name="trailer" initialValue={false}>
          <Radio.Group disabled={isEdit}>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="启用状态"
          name="state"
          initialValue={true}
          valuePropName="checked"
        >
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreateForm;
