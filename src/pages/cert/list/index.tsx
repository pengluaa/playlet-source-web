import React, { useRef, useState } from 'react';
import { Form, Button, Input, TableColumnType, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';

import PageHeader from '@/components/PageHeader';
import FormSearch from '@/components/FormSearch';
import CustomizeTable from '@/components/Table';
import TableMore from '@/components/TableMoreButton';
import CreateForm from './_createForm';

import {
  getList as getListSv,
  del as delSv,
  refresh as refreshSv,
} from './service';
import { getRandomString } from '@/utils/util';

const List = () => {
  const [searchValues, setSearchValues] = useState<any>({});
  const [update, setUpdate] = useState<boolean>(false);

  const createRef = useRef<ModalFormRef>(null);

  const refresh = () => {
    setUpdate(!update);
  };

  const refreshCertStatus = async (id: number) => {
    const key = getRandomString();
    message.loading({
      key,
      content: `ID【${id}】刷新中..`,
      duration: 60e3,
    });
    const { error } = await refreshSv(id);
    if (error) return;
    refresh();
    message.success({
      key,
      content: `ID【${id}】刷新成功`,
    });
  };

  const deleteItem = async (id: number) => {
    const { error } = await delSv(id);
    if (error) return;
    refresh();
  };

  const columns: TableColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 88,
    },
    {
      title: '域名',
      dataIndex: 'domain',
      width: 160,
      ellipsis: true,
    },
    {
      title: '过期时间',
      dataIndex: 'expired',
      width: 160,
      ellipsis: true,
      render(val) {
        if (!val) return '-';
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '证书状态',
      dataIndex: 'status',
      width: 160,
      ellipsis: true,
      render(val) {
        if (val === 'ACTIVE') {
          return <Tag color="green">正常</Tag>;
        }
        if (val === 'EXPIRED') {
          return <Tag color="red">过期</Tag>;
        }
        if (val === 'SELF_SIGNED') {
          return <Tag color="warning">自签证书</Tag>;
        }
        if (val === 'NOT_CERT') {
          return <Tag color="magenta">没有证书</Tag>;
        }
        return <Tag color="error">未知</Tag>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 160,
    },
    {
      title: '最后检测时间',
      dataIndex: 'lastDetection',
      width: 170,
      render(val) {
        if (!val) return '-';
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
      },
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
                text: '刷新',
                onClick() {
                  refreshCertStatus(value);
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
      <PageHeader title="证书列表" />
      <FormSearch onChange={setSearchValues}>
        <Form.Item label="域名" name="domain">
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

      <CreateForm ref={createRef} onOk={refresh} />
    </>
  );
};

export default List;
