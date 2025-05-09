import React, { useEffect, useState, useRef } from 'react';
import { Button, Table, Card, TableColumnType, Row, Col, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import PageHeader from '@/components/PageHeader';

import {
  getMenuList as getMenuListSv,
  deleteMenu as deleteMenuSv,
} from './service';
import TableMore from '@/components/TableMoreButton';
import CreateForm from './_createForm';
import { buildTree, deepCopy } from '@/utils/util';
import RenderState from '@/components/Render/State';

const Menu = () => {
  const [tableDatas, setTableDatas] = useState<any[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [expandKeys, setExpandKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>();

  const createRef = useRef<ModalFormRef>(null);

  const handleCreateTreeData = (datas: MenuItem[]) => {
    datas = datas.filter((item) => item.type !== 3);
    setTreeData(buildTree(datas, 'id', 'pid'));
  };

  const getMenuList = async () => {
    const { error, data } = await getMenuListSv();
    if (error) return;
    setTableDatas(buildTree(deepCopy(data), 'id', 'pid'));
    handleCreateTreeData(deepCopy(data));
  };

  const deleteItem = async (id: string) => {
    setLoading(true);
    const { error } = await deleteMenuSv(id);
    setLoading(false);
    if (error) return;
    getMenuList();
  };

  const expandable = {
    expandedRowKeys: expandKeys,
    onExpandedRowsChange(keys: any) {
      setExpandKeys(keys);
    },
  };

  const columns: TableColumnType<any>[] = [
    {
      width: 250,
      title: '菜单名称',
      dataIndex: 'name',
      render(value, record) {
        return record.type === 3 ? <Tag color="blue">{value}</Tag> : value;
      },
    },
    {
      width: 150,
      title: '前端路由',
      dataIndex: 'route',
    },
    {
      width: 150,
      title: '后端接口',
      dataIndex: 'apis',
      ellipsis: true,
    },
    {
      width: 88,
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 66,
      render(value) {
        return <RenderState value={value} />
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      fixed: 'right',
      width: 220,
      render(value, record) {
        return (
          <TableMore
            buttons={[
              {
                id: 1,
                text: '添加子菜单',
                disabled: record.type === 3,
                onClick() {
                  createRef.current?.add?.(record);
                },
              },
              {
                id: 2,
                text: '编辑',
                onClick() {
                  createRef.current?.edit?.(record);
                },
              },
              {
                id: 3,
                text: '删除',
                popconfirm: true,
                popconfirmProps: {
                  title: '确定删除此菜单及其全部子菜单？',
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

  useEffect(() => {
    getMenuList();
  }, []);

  return (
    <>
      <PageHeader title="菜单管理" />
      <Card
        variant="borderless"
        styles={{
          body: {
            padding: 16,
          },
        }}
      >
        <Row gutter={10} style={{ marginBottom: 16 }}>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => createRef.current?.add?.()}
            >
              新增
            </Button>
          </Col>
        </Row>
        <Table
          rowKey="id"
          bordered={false}
          loading={loading}
          columns={columns}
          dataSource={tableDatas}
          expandable={{ ...expandable }}
          pagination={false}
          scroll={{ x: '100%' }}
        />
      </Card>

      <CreateForm ref={createRef} treeData={treeData} onOk={getMenuList} />
    </>
  );
};

export default Menu;
