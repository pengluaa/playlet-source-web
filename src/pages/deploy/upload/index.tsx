import React, { useRef, useState } from 'react';
import { Form, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import FormSearch from '@/components/FormSearch';
import CustomizeTable, { CustomizeTableColumType } from '@/components/Table';
import TableMore from '@/components/TableMoreButton';
import RenderState from '@/components/Render/State';
import {
  DeployStatus,
  DeployStatusSelect,
  DeployStatusTag,
} from '../_deployStatus';
import CreateForm from './_createForm';
import ProjectSelect from './_projectSelect';

import {
  getList as getListSv,
  del as delSv,
  redeploy as redeploySv,
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
    refresh();
  };

  const redeploy = async (id: number) => {
    const { error } = await redeploySv(id);
    if (error) return;
    refresh();
  };

  const columns: CustomizeTableColumType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 88,
    },
    {
      title: '项目名称',
      dataIndex: ['project', 'name'],
      width: 160,
      ellipsis: true,
    },
    {
      title: '版本号',
      dataIndex: 'version',
      width: 130,
      ellipsis: true,
      render(value) {
        return <Tag>v{value}</Tag>;
      },
    },
    {
      title: '版本描述',
      dataIndex: 'description',
      width: 180,
      ellipsis: true,
    },
    {
      title: '部署时间',
      dataIndex: 'deployAt',
      width: 170,
      timeField: true,
    },
    {
      title: '是否完成',
      dataIndex: 'done',
      width: 120,
      render(value) {
        return <RenderState value={value} trueText="完成" falseText="未完成" />;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render(value) {
        return <DeployStatusTag value={value} />;
      },
    },
    {
      title: 'md5',
      dataIndex: 'md5',
      width: 160,
      ellipsis: true,
    },
    {
      title: 'sha256',
      dataIndex: 'sha256',
      width: 160,
      ellipsis: true,
    },
    {
      title: '拒绝原因',
      dataIndex: 'rejectReason',
      width: 200,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 170,
      timeField: true,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 130,
      fixed: 'right',
      render(value, record) {
        const status = record.status as DeployStatus;
        return (
          <TableMore
            buttons={[
              {
                id: 3,
                text: '删除',
                popconfirm: true,
                disabled: status === 'SUCCESS',
                popconfirmProps: {
                  title: '确认删除？',
                  onConfirm() {
                    deleteItem(value);
                  },
                },
              },
              {
                id: 4,
                text: '重新部署',
                hidden: !(
                  [
                    'CONNECT_AUTH_ERR',
                    'CONNECT_FAIL',
                    'CONNECT_TIMEOUT',
                  ] as DeployStatus[]
                ).includes(status),
                popconfirm: true,
                popconfirmProps: {
                  title: '确认重新部署？',
                  onConfirm() {
                    redeploy(value);
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
      <PageHeader title="上传项目" />
      <FormSearch onChange={setSearchValues}>
        <Form.Item label="项目" name="projectId">
          <ProjectSelect />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <DeployStatusSelect />
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
