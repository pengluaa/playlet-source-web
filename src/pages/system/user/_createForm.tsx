import { useImperativeHandle, useState, forwardRef, useEffect } from 'react';
import { Form, Input, Modal, Select, message } from 'antd';
import md5 from 'blueimp-md5';
import { validatePassword } from '@/utils/util';
import { submit as submitSv } from './service';
import { getList as getRoleListSv } from '@/pages/system/role/service';

interface Props {
  onOk?: () => void;
}

const CreateForm = forwardRef((props: Props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [title, setTitle] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState<boolean>();

  const [form] = Form.useForm();

  const getRoleList = async () => {
    const { error, data } = await getRoleListSv({
      page: 1,
    });
    if (error) return;
    setRoleList(data.list);
  };

  const submit = async () => {
    try {
      const values = await form.validateFields();
      delete values.confirmPwd;
      if (values.password) {
        values.password = md5(values.password);
      }
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
      setView(false);
    },
    edit: (values) => {
      setTitle('编辑');
      setOpen(true);
      setView(false);
      setIsEdit(true);

      setFormValues({
        ...values,
        roleIds: values.userRoles.map((item: any) => item.roleId),
      });
    },
    view(values) {
      setTitle('详情');
      setView(true);
      setOpen(true);
      setFormValues(values);
    },
  }));

  useEffect(() => {
    getRoleList();
  }, []);

  return (
    <Modal
      title={title}
      confirmLoading={submitLoading}
      width={800}
      open={open}
      okButtonProps={{ style: { display: view ? 'none' : undefined } }}
      onCancel={onCancel}
      onOk={submit}
    >
      <Form
        labelAlign="right"
        form={form}
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 6 }}
      >
        <Form.Item label="id" name="id" hidden>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="登录名"
          name="account"
          rules={[{ required: true }]}
          hidden={isEdit}
        >
          <Input autoComplete="off" placeholder="请输入" />
        </Form.Item>
        <Form.Item label="姓名" name="username" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: !isEdit,
              validator(rule, value) {
                if (!validatePassword(value)) {
                  return Promise.reject(
                    '需满足大小写字母+数字组合密码长度大于等于8位',
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            autoComplete="new-password"
            maxLength={20}
            placeholder="请输入"
          />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="confirmPwd"
          hidden={isEdit}
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: !isEdit },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次密码输入不一致'));
              },
            }),
          ]}
        >
          <Input.Password autoComplete="off" placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="角色"
          name="roleIds"
          tooltip="请选择一个角色，如果还未设置，请马上设置"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="请选择"
            mode="multiple"
            options={roleList}
            fieldNames={{ value: 'id', label: 'name' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreateForm;
