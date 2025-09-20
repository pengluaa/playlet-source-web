import { useState, useRef } from 'react';
import { Form, Input, Space, Typography } from 'antd';
import PageHeader from '@/components/PageHeader';
import FormSearch from '@/components/FormSearch';
import CustomizeTable, { CustomizeTableColumType } from '@/components/Table';
import TableMore from '@/components/TableMoreButton';
import RenderState from '@/components/Render/State';
import Check from './_check';
import {
  DeployStatus,
  DeployStatusSelect,
  DeployStatusTag,
} from '../_deployStatus';
import ProjectSelect from '../upload/_projectSelect';
import { getList as getListSv } from './service';

const List = () => {
  const [searchValues, setSearchValues] = useState<any>({});
  const [update, setUpdate] = useState<boolean>(false);

  const checkRef = useRef<ModalFormRef>(null);

  const refresh = () => {
    setUpdate(!update);
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
      width: 120,
    },
    {
      title: '上传用户',
      dataIndex: 'user',
      width: 220,
      render(value) {
        return (
          <Space size={10}>
            <Space size={2}>
              <Typography.Text type="secondary">账号:</Typography.Text>
              <Typography.Text>{value.account}</Typography.Text>
            </Space>
            <Space size={2}>
              <Typography.Text type="secondary">用户名:</Typography.Text>
              <Typography.Text>{value.username}</Typography.Text>
            </Space>
          </Space>
        );
      },
    },
    {
      title: '是否完成',
      dataIndex: 'done',
      width: 88,
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
      title: '拒绝原因',
      dataIndex: 'rejectReason',
      width: 200,
      ellipsis: true,
    },
    {
      title: '发起时间',
      dataIndex: 'createdAt',
      width: 170,
      timeField: true,
    },
    {
      title: '部署时间',
      dataIndex: 'deployAt',
      width: 170,
      timeField: true,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 88,
      fixed: 'right',
      render(value, record) {
        const status = record.status as DeployStatus;
        return (
          <TableMore
            buttons={[
              {
                id: 1,
                text: '审核',
                disabled: status !== 'REVIEW',
                onClick() {
                  checkRef.current?.edit?.(record);
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
      <PageHeader title="部署审核" />
      <FormSearch
        initialValues={{ status: 'REVIEW' }}
        onChange={setSearchValues}
      >
        <Form.Item label="项目" name="projectId">
          <ProjectSelect />
        </Form.Item>
        <Form.Item label="状态" name="status" hidden>
          <DeployStatusSelect />
        </Form.Item>
      </FormSearch>
      <CustomizeTable
        update={update}
        params={searchValues}
        columns={columns}
        fetchFn={getListSv}
      />

      <Check ref={checkRef} onOk={refresh} />
    </>
  );
};

export default List;
