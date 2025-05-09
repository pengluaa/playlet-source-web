import { useImperativeHandle, useState, forwardRef } from 'react';
import { Form, Input, InputNumber, Modal, Space, Switch, message } from 'antd';
import UploadImage from '@/components/UploadImage';
import FormatSelect from '@/components/Common/FormatSelect';
import ChannelSelect from '@/components/Common/ChannelSelect';
import SourceSelect from './_sourceSelect';
import { submit as submitSv } from './service';

interface Props {
  onOk?: () => void;
}

const CreateForm = forwardRef((props: Props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>();
  const [submitLoading, setSubmitLoading] = useState<boolean>();

  const [form] = Form.useForm();
  const watermark = Form.useWatch('watermark', form);
  const isFree = Form.useWatch('isFree', form);

  const submit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      const { error } = await submitSv(values);
      setSubmitLoading(false);

      if (error) return;
      message.success('提交成功');
      // onCancel();
      // props.onOk?.();
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
        <Form.Item label="源视频" name="sourceId" rules={[{ required: true }]}>
          <SourceSelect disabled={isEdit} />
        </Form.Item>
        <Form.Item
          label="分辨率设置"
          name="formats"
          rules={[{ required: true }]}
        >
          <FormatSelect mode="multiple" />
        </Form.Item>
        <Form.Item label="渠道" name="channels" rules={[{ required: true }]}>
          <ChannelSelect mode="multiple" />
        </Form.Item>
        <Form.Item
          label="展示水印"
          name="watermark"
          initialValue={false}
          valuePropName="checked"
          required
        >
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        <Form.Item
          hidden={!watermark}
          label="水印"
          name="watermarkImg"
          rules={[{ required: watermark }]}
        >
          <UploadImage multiple={false} />
        </Form.Item>
        <Form.Item
          label="是否免费"
          name="isFree"
          initialValue={true}
          valuePropName="checked"
          required
        >
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        {/* 收费配置 */}

        <Form.Item
          hidden={isFree}
          required
          label="付费配置"
          style={{ marginBottom: 0 }}
        >
          <Space>
            <Form.Item
              name="payEpisode"
              rules={[{ required: !isFree, message: '请输入付费开始集数' }]}
            >
              <InputNumber
                min={1}
                precision={0}
                addonAfter="集开始"
                addonBefore="从"
                placeholder="请输入"
              />
            </Form.Item>
            <Form.Item
              name="price"
              rules={[{ required: !isFree, message: '请输入单集价格' }]}
            >
              <InputNumber
                min={0}
                placeholder="请输入"
                addonBefore="单集价格 ¥"
              />
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item
          label="启用状态"
          name="state"
          initialValue={true}
          valuePropName="checked"
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreateForm;
