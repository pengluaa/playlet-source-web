import React, { useRef, useState } from 'react';
import { Form, Button, TableColumnType, message, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import FormSearch from '@/components/FormSearch';
import CustomizeTable from '@/components/Table';
import TableMore from '@/components/TableMoreButton';
import CreateForm from './_createForm';

import { getList as getListSv, del as delSv } from './service';
import DeployHistory from './_history';
import ProjectSelect from '../upload/_projectSelect';
import RenderText from '@/components/Render/Text';

const List = () => {
  const [searchValues, setSearchValues] = useState<any>({});
  const [update, setUpdate] = useState<boolean>(false);

  const createRef = useRef<ModalFormRef>(null);
  const historyRef = useRef<ModalFormRef>(null);

  const refresh = () => {
    setUpdate(!update);
  };

  const deleteItem = async (id: number) => {
    const { error } = await delSv(id);
    if (error) return;
    message.success('删除成功');
    refresh();
  };

  const columns: TableColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 88,
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 160,
      ellipsis: true,
    },
    {
      title: '服务器名称',
      dataIndex: ['server', 'name'],
      width: 180,
      ellipsis: true,
    },
    {
      title: '最后部署项目',
      dataIndex: 'deployItems',
      width: 280,
      render(items) {
        const item = items[0];
        if (!item) {
          return null;
        }
        return (
          <Space size={4}>
            <RenderText timeField value={item.deployAt} />
            <Tag color="blue">v{item.version}</Tag>
          </Space>
        );
      },
    },
    {
      title: '服务器IP',
      dataIndex: ['server', 'host'],
      width: 160,
      ellipsis: true,
    },
    {
      title: '目录',
      dataIndex: 'dir',
      width: 180,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 240,
      ellipsis: true,
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
                text: '部署历史',
                onClick() {
                  historyRef.current?.view?.(record);
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
      <PageHeader title="项目管理" />
      <FormSearch onChange={setSearchValues}>
        <Form.Item label="名称" name="id">
          <ProjectSelect />
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
      <DeployHistory ref={historyRef} />
    </>
  );
};

export default List;
