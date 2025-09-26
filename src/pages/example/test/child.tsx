import React, { useState } from 'react';
import { Form, Input, DatePicker } from 'antd';
import PageHeader from '@/components/PageHeader';
import FormSearch from '@/components/FormSearch';
import CustomizeTable, { CustomizeTableColumType } from '@/components/Table';
import TableMore from '@/components/TableMoreButton';

const List = () => {
  const [searchValues, setSearchValues] = useState<any>({});
  const [update, setUpdate] = useState<boolean>(false);

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

  return (
    <>
      <PageHeader showback backConfirm title="子页面" toolTip="hello world" />
      <FormSearch onChange={setSearchValues}>
        <Form.Item label="名称1" name="name1">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="名称2" name="name2">
          <DatePicker.RangePicker showTime={false} />
        </Form.Item>
        <Form.Item label="名称3" name="name3">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="名称4" name="name4">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="名称5" name="name5">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="名称6" name="name6">
          <Input placeholder="请输入" />
        </Form.Item>
      </FormSearch>
      <CustomizeTable
        update={update}
        params={searchValues}
        columns={columns}
        fetchFn={getList}
      />
    </>
  );
};

export default List;
