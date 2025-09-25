import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Table,
  Card,
  TableColumnType,
  Row,
  Col,
  Tag,
  Modal,
  Form,
  Input,
  message,
} from 'antd';
import md5 from 'blueimp-md5';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';

import TableMore from '@/components/TableMoreButton';
import RenderState from '@/components/Render/State';
import CreateForm from './_createForm';
import { buildTree, deepCopy } from '@/utils/util';
import { signSalt } from '@/common';
import {
  getMenuList as getMenuListSv,
  deleteMenu as deleteMenuSv,
} from './service';

const Menu = () => {
  const [tableDatas, setTableDatas] = useState<any[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [expandKeys, setExpandKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>();
  const [openDel, setOpenDel] = useState<boolean>(false);

  const createRef = useRef<ModalFormRef>(null);
  const [form] = Form.useForm();

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

  const deleteItem = async (values: any) => {
    setLoading(true);
    values.confirmPwd = md5(values.confirmPwd + signSalt);
    const { error } = await deleteMenuSv(values);
    setLoading(false);
    if (error) return;
    message.success('删除成功');
    setOpenDel(false);
    getMenuList();
  };

  const deleteConfirm = async () => {
    try {
      const values = await form.validateFields();
      Modal.confirm({
        type: 'warn',
        title: '确定删除此菜单，以及其全部子菜单(如果存在)？',
        content: '数据无法恢复，请慎重操作！',
        onOk() {
          deleteItem(values);
        },
      });
    } catch (error) {
      // ..
    }
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
        return <RenderState value={value} />;
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
                onClick() {
                  form.setFieldsValue({
                    id: value,
                    confirmPwd: void 0,
                  });
                  setOpenDel(true);
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

      <Modal
        title="删除确认？"
        open={openDel}
        onCancel={() => setOpenDel(false)}
        onOk={() => deleteConfirm()}
      >
        <Form
          autoComplete="off"
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item hidden label="id" name="id">
            <Input autoComplete="off" placeholder="请输入" />
          </Form.Item>
          <Form.Item label="密码" name="confirmPwd" rules={[{ required: true }]}>
            <Input.Password autoComplete="new-password" placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Menu;
