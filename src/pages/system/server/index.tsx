import React, { useRef, useState } from 'react';
import { Form, Button, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import FormSearch from '@/components/FormSearch';
import CustomizeTable, { CustomizeTableColumType } from '@/components/Table';
import TableMore from '@/components/TableMoreButton';

import CreateForm from './_createForm';
import { ServerStatusTag } from './_serverStatus';
import {
  getList as getListSv,
  del as delSv,
  refreshStatus as refreshStatusSv,
} from './service';

const List = () => {
  const [searchValues, setSearchValues] = useState<any>({});
  const [update, setUpdate] = useState<boolean>(false);

  const createRef = useRef<ModalFormRef>(null);

  const refresh = () => {
    setUpdate(!update);
  };

  const deleteItem = async (id: number) => {
    const { error } = await delSv(id);
    if (error) return;
    message.success('删除成功');
    refresh();
  };
  const refreshConn = async (id: number) => {
    const { error } = await refreshStatusSv(id);
    if (error) return;
    message.success('操作成功');
    refresh();
  };

  const columns: CustomizeTableColumType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 88,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '服务器地址',
      dataIndex: 'host',
      width: 180,
    },
    {
      title: '端口',
      dataIndex: 'port',
      width: 120,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render(value) {
        return <ServerStatusTag value={value} />;
      },
    },
    {
      title: '连接时间',
      dataIndex: 'connAt',
      timeField: true,
      width: 170,
    },
    {
      title: '使用范围',
      dataIndex: 'scope',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 170,
      timeField: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 170,
      timeField: true,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 160,
      fixed: 'right',
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
                text: '刷新',
                onClick() {
                  refreshConn(value);
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
      <PageHeader title="服务器管理" />
      <FormSearch onChange={setSearchValues}>
        <Form.Item label="名称" name="name">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="服务器地址" name="host">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="用户名" name="username">
          <Input placeholder="请输入" />
        </Form.Item>
      </FormSearch>
      <CustomizeTable
        update={update}
        headerContent={<Header />}
        fetchFn={getListSv}
        params={searchValues}
        columns={columns}
      />

      <CreateForm ref={createRef} onOk={refresh} />
    </>
  );
};

export default List;
