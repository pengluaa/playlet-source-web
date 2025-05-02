import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Input, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import FormSearch from '@/components/FormSearch';
import CustomizeTable, { CustomizeTableColumType } from '@/components/Table';
import TableMore from '@/components/TableMoreButton';
import CreateForm from './_createForm';

import { getList as getListSv, del as deleteSv } from './service';

const Administrators = () => {
  const [update, setUpdate] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<any>({});

  const createRef = useRef<ModalFormRef>(null);

  const refresh = () => {
    setUpdate(!update);
  };

  const deleteItem = async (id: string) => {
    setLoading(true);
    const { error } = await deleteSv(id);
    setLoading(false);
    if (error) return;
    setUpdate(!update);
  };

  const columns: CustomizeTableColumType<any>[] = [
    {
      title: '登陆名',
      dataIndex: 'account',
      width: 160,
      fixed: 'left',
    },
    {
      title: '姓名',
      dataIndex: 'username',
      width: 160,
      fixed: 'left',
    },
    {
      title: '上次登录',
      dataIndex: 'lastLoginDate',
      timeField: true,
      width: 160,
    },
    {
      title: '登录次数',
      dataIndex: 'loginCount',
      width: 120,
    },
    {
      title: '角色',
      dataIndex: 'userRoles',
      width: 160,
      render(roles: any[]) {
        if (!roles) {
          return;
        }
        return (
          <Space wrap size={2}>
            {roles.map((item) => (
              <Tag key={item.id}>{item.role.name}</Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      fixed: 'right',
      width: 120,
      render(value, record) {
        return (
          <TableMore
            buttons={[
              {
                id: 1,
                text: '编辑',
                onClick() {
                  createRef.current?.edit?.(record);
                },
              },
              {
                id: 2,
                text: '删除',
                popconfirm: true,
                popconfirmProps: {
                  title: '确认删除？',
                  onConfirm(e) {
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
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => createRef.current?.add?.()}
      >
        新增
      </Button>
    );
  };

  return (
    <>
      <PageHeader title="用户管理" />
      <FormSearch onChange={setSearchValue}>
        <Form.Item label="登录名" name="account">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="姓名" name="username">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="角色名称" name="role_name">
          <Input placeholder="请输入" />
        </Form.Item>
      </FormSearch>

      <CustomizeTable
        rowKey="id"
        headerContent={<Header />}
        columns={columns}
        loading={loading}
        update={update}
        params={searchValue}
        fetchFn={getListSv}
      />
      <CreateForm ref={createRef} onOk={refresh} />
    </>
  );
};

export default Administrators;
