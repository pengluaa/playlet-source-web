import React, { useRef, useState } from 'react';
import { Form, Button, Input, TableColumnType } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import FormSearch from '@/components/FormSearch';
import CustomizeTable from '@/components/Table';
import TableMore from '@/components/TableMoreButton';
import CreateForm from './_createForm';

const Role = () => {
  const [searchValues, setSearchValues] = useState<any>({});
  const [update, setUpdate] = useState<boolean>(false);

  const createRef = useRef<ModalFormRef>(null);

  const refrsh = () => {
    setUpdate(!update);
  };

  const deleteItem = (id: number) => {};

  const columns: TableColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '描述',
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
                text: '编辑',
                onClick() {
                  createRef.current?.edit?.(record);
                },
              },
              {
                id: 2,
                text: '查看',
                onClick() {
                  createRef.current?.view?.(record);
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
      <PageHeader title="示例" />
      <FormSearch onChange={setSearchValues}>
        <Form.Item label="名称" name="name">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="描述" name="remark">
          <Input placeholder="请输入" />
        </Form.Item>
      </FormSearch>
      <CustomizeTable
        update={update}
        headerContent={<Header />}
        params={searchValues}
        columns={columns}
      />

      <CreateForm ref={createRef} onOk={refrsh} />
    </>
  );
};

export default Role;
