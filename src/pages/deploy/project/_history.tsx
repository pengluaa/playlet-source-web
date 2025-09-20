import { useImperativeHandle, useState, forwardRef } from 'react';
import { message, Modal } from 'antd';
import CustomizeTable, { CustomizeTableColumType } from '@/components/Table';

import RenderState from '@/components/Render/State';
import { DeployStatusTag } from '../_deployStatus';

import {
  getHistorys as getHistorysSv,
  rollback as rollbackSv,
} from './service';
import TableMore from '@/components/TableMoreButton';
import { getRandomString } from '@/utils/util';

interface Props {
  onOk?: () => void;
}

const DeployHistory = forwardRef((props: Props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>();
  const [params, setParams] = useState<any>();

  useImperativeHandle<any, ModalFormRef>(ref, () => ({
    view(values) {
      setTitle(values.name);
      setParams({
        id: values.id,
      });
      setOpen(true);
    },
  }));  
  const rollback = async (itemId: number) => {
    const key = getRandomString();
    message.open({
      key,
      type: 'loading',
      content: '回滚中..',
      duration: 0,
    });
    const { error } = await rollbackSv(itemId);
    message.destroy(key);
    if (error) return;
    message.success('回滚成功');
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
      width: 160,
      ellipsis: true,
    },
    {
      title: '版本描述',
      dataIndex: 'description',
      width: 180,
      ellipsis: true,
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
      title: '拒绝原因',
      dataIndex: 'rejectReason',
      width: 200,
      ellipsis: true,
    },
    {
      title: '部署时间',
      dataIndex: 'deployAt',
      width: 170,
      timeField: true,
    },
    {
      title: '审核时间',
      dataIndex: 'checkAt',
      width: 170,
      timeField: true,
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
      width: 120,
      fixed: 'right',
      render(value, record) {
        return (
          <TableMore
            buttons={[
              {
                id: 1,
                disabled: record.status !== 'SUCCESS',
                permisson: 'manage',
                text: '回滚此版本',
                popconfirm: true,
                popconfirmProps: {
                  title: '此操作不可撤销，是否确认回滚？',
                  onConfirm() {
                    rollback(value);
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
    <Modal
      title={title}
      width={960}
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
    >
      <CustomizeTable
        columns={columns}
        params={params}
        fetchFn={getHistorysSv}
      />
    </Modal>
  );
});

export default DeployHistory;
