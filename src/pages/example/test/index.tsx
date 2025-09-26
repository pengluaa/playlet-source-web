import React, { useRef, useState } from 'react';
import { Form, Button, Input, DatePicker, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import FormSearch from '@/components/FormSearch';
import CustomizeTable, { CustomizeTableColumType } from '@/components/Table';
import TableMore from '@/components/TableMoreButton';
import { Link } from 'umi';

const List = () => {
  const [searchValues, setSearchValues] = useState<any>({});
  const [update, setUpdate] = useState<boolean>(false);

  const createRef = useRef<ModalFormRef>(null);

  const refresh = () => {
    setUpdate(!update);
  };

  const getList = async (params: unknown) => {
    return {
      error: false,
      code: 1,
      data: {},
      msg: '',
    } as ResponseOk;
  };

  const deleteItem = (id: number) => {};

  const columns: CustomizeTableColumType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'id',
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
      <Space>
        <Button type="primary">
          <Link to="/example/test/child">打开子页面</Link>
        </Button>
      </Space>
    );
  };

  return (
    <>
      <PageHeader title="测试" />
      <FormSearch>
        <Form.Item label="名称1" name="name1">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="名称2" name="name2">
          <DatePicker.RangePicker showTime={false} />
        </Form.Item>
        <Form.Item label="名称3" name="name3">
          <Input placeholder="请输入" />
        </Form.Item>
      </FormSearch>
      <CustomizeTable
        update={update}
        headerContent={<Header />}
        params={searchValues}
        columns={columns}
        fetchFn={getList}
      />
    </>
  );
};

export default List;
