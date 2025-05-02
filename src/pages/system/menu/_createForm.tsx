import { useImperativeHandle, useState, forwardRef } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  TreeSelect,
  message,
} from 'antd';
import { submit as submitSv } from './service';

interface Props {
  treeData: any[];
  onOk?: () => void;
}

const CreateForm = forwardRef((props: Props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState<boolean>();

  const [form] = Form.useForm();
  const isBtnPermission = Form.useWatch('type', form) === 3;

  const submit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      if (values.apis) {
        values.apis = values.apis.join(',');
      }
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
    add: (values) => {
      setTitle('新增');
      setOpen(true);
      setView(false);
      form.setFieldValue('pid', values?.id);
    },
    edit: (values) => {
      setTitle('编辑');
      setOpen(true);
      setView(false);

      setFormValues({
        ...values,
        apis: values.apis ? values.apis.split(',') : null,
      });
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
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="id" name="id" hidden>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="上级" name="pid" rules={[{ required: true }]}>
          <TreeSelect
            treeData={[{ id: 0, name: '顶级菜单' }, ...props.treeData]}
            fieldNames={{ label: 'name', value: 'id' }}
            placeholder="请选择"
          />
        </Form.Item>
        <Form.Item label="名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="菜单类型" name="type" rules={[{ required: true }]}>
          <Select placeholder="请输入">
            {/* 所有用户都可见 */}
            <Select.Option value={1}>仅菜单（全部用户可见）</Select.Option>
            {/* 菜单+权限 */}
            <Select.Option value={2}>菜单+权限</Select.Option>
            {/* 按钮+权限 */}
            <Select.Option value={3}>权限+按钮</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="按钮权限"
          name="permission"
          hidden={!isBtnPermission}
          rules={[{ required: isBtnPermission }]}
        >
          <Select placeholder="请选择">
            <Select.Option value="add">新增</Select.Option>
            <Select.Option value="edit">编辑</Select.Option>
            <Select.Option value="delete">删除</Select.Option>
            <Select.Option value="save">保存</Select.Option>
            <Select.Option value="refresh">刷新</Select.Option>
            <Select.Option value="manage">管理</Select.Option>
            <Select.Option value="import">导入</Select.Option>
            <Select.Option value="export">导出</Select.Option>
            <Select.Option value="download">下载</Select.Option>
            <Select.Option value="view">查看</Select.Option>
            <Select.Option value="log">日志</Select.Option>
            <Select.Option value="confirm">确认</Select.Option>
            <Select.Option value="reject">驳回</Select.Option>
            <Select.Option value="offline">转线下</Select.Option>
            <Select.Option value="check">审核</Select.Option>
            <Select.Option value="default">默认</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="后端接口" name="apis">
          <Select mode="tags" placeholder="请输入" />
        </Form.Item>
        <Form.Item hidden={isBtnPermission} label="前端路由" name="route">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item hidden={isBtnPermission} label="图标" name="icon">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item hidden={isBtnPermission} label="备注" name="remark">
          <Input.TextArea rows={4} placeholder="请输入" />
        </Form.Item>
        <Form.Item
          hidden={isBtnPermission}
          label="排序"
          name="sort"
          initialValue={0}
        >
          <InputNumber placeholder="请输入" />
        </Form.Item>
        <Form.Item label="状态" name="state" initialValue={true}>
          <Radio.Group>
            <Radio value={true}>启用</Radio>
            <Radio value={false}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreateForm;
