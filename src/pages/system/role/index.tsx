import React, { useRef, useState } from 'react';
import { Modal, Form, Button, Input, TableColumnType, Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import FormSearch from '@/components/FormSearch';
import MenuTree from './_menuTree';
import CustomizeTable from '@/components/Table';
import TableMore from '@/components/TableMoreButton';
import CreateForm from './_createForm';

import {
  getList as getListSv,
  getAuthIds as getAuthIdsSv,
  del as deleteSv,
  auth as authSv,
} from './service';

const Role = () => {
  const [visibleAuth, setVisibleAuth] = useState<boolean>();
  const [searchValues, setSearchValues] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);

  const [formAuth] = Form.useForm();
  const createRef = useRef<ModalFormRef>(null);

  const refrsh = () => {
    setUpdate(!update);
  };

  const create = () => {
    createRef.current?.add?.();
  };

  const deleteItem = async (id: string) => {
    setLoading(true);
    const { error } = await deleteSv(id);
    setLoading(false);
    if (error) return;
    refrsh();
  };

  const edit = (record: any) => {
    createRef.current?.edit?.(record);
  };

  const authEdit = async (id: number) => {
    setVisibleAuth(true);
    setLoading(true);
    formAuth.resetFields();
    const { error, data } = await getAuthIdsSv(id);
    setLoading(false);
    if (error) return;
    formAuth.setFieldsValue({
      roleId: id,
      menuIds: data.map((item) => item.menuId),
    });
  };

  const submitAuth = async () => {
    const values = formAuth.getFieldsValue();
    const { error } = await authSv(values);
    if (error) return;
    message.success('授权成功');
    setVisibleAuth(false);
    refrsh();
  };

  const columns: TableColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '角色描述',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      render(value, record) {
        return (
          <TableMore
            buttons={[
              {
                id: 1,
                text: '授权',
                onClick() {
                  authEdit(value);
                },
              },
              {
                id: 2,
                text: '编辑',
                onClick() {
                  edit(record);
                },
              },
              {
                id: 3,
                text: '删除',
                popconfirm: true,
                popconfirmProps: {
                  title: '确认删除？',
                  onConfirm() {
                    deleteItem(value);
                  },
                },
              },
            ]}
          />
        );
      },
    },
  ];

  const Header = () => {
    return (
      <Button type="primary" icon={<PlusOutlined />} onClick={create}>
        新增
      </Button>
    );
  };

  return (
    <>
      <PageHeader title="角色管理" />
      <FormSearch onChange={setSearchValues}>
        <Form.Item label="角色名" name="name">
          <Input placeholder="请输入" />
        </Form.Item>
      </FormSearch>
      <CustomizeTable
        update={update}
        headerContent={<Header />}
        params={searchValues}
        columns={columns}
        fetchFn={getListSv}
      />

      <CreateForm ref={createRef} onOk={refrsh} />
      <Modal
        title="权限设置"
        maskClosable={false}
        open={visibleAuth}
        confirmLoading={loading}
        onOk={submitAuth}
        onCancel={() => setVisibleAuth(false)}
      >
        <Spin spinning={loading}>
          <Form form={formAuth}>
            <Form.Item label="roleId" name="roleId" hidden>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="menuIds">
              <MenuTree defaultExpandAll={false} />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default Role;
