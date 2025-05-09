import React, { useRef, useState } from 'react';
import { Form, Button, Input, TableColumnType } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import FormSearch from '@/components/FormSearch';
import CustomizeTable from '@/components/Table';
import TableMore from '@/components/TableMoreButton';
import RenderImage from '@/components/Render/Image';
import RenderState from '@/components/Render/State';
import RenderBool from '@/components/Render/Bool';
import CreateForm from './_createForm';

import { getList as getListSv } from './service';
import SubsetDrawer from './_subsetDrawer';

const Source = () => {
  const [searchValues, setSearchValues] = useState<any>({});
  const [update, setUpdate] = useState<boolean>(false);

  const createRef = useRef<ModalFormRef>(null);
  const subsetRef = useRef<ModalFormRef>(null);

  const refrsh = () => {
    setUpdate(!update);
  };

  const deleteItem = (id: number) => {};

  const columns: TableColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 66,
      fixed: 'left',
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 120,
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'remark',
      width: 120,
      ellipsis: true,
    },
    {
      title: '总集数',
      dataIndex: 'episodes',
      width: 66,
      ellipsis: true,
    },
    {
      title: '封面',
      dataIndex: 'poster',
      width: 88,
      render(value) {
        return <RenderImage value={value} />;
      },
    },
    {
      title: '是否有预告片',
      dataIndex: 'trailer',
      width: 120,
      render(value) {
        return <RenderBool value={value} />
      },
    },
    {
      title: '启用状态',
      dataIndex: 'state',
      width: 88,
      render(value) {
        return <RenderState value={value} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 180,
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
                text: '子集',
                onClick() {
                  subsetRef.current?.edit?.(record);
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
      <PageHeader title="源视频" />
      <FormSearch onChange={setSearchValues}>
        <Form.Item label="名称" name="name">
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

      <CreateForm ref={createRef} onOk={refrsh} />
	  <SubsetDrawer ref={subsetRef} />
    </>
  );
};

export default Source;
