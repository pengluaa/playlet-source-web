import React, { useRef, useState } from 'react';
import { Form, Button, Input, TableColumnType } from 'antd';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import FormSearch from '@/components/FormSearch';
import CustomizeTable from '@/components/Table';
import TableMore from '@/components/TableMoreButton';
import RenderImage from '@/components/Render/Image';
import RenderState from '@/components/Render/State';
import RenderBool from '@/components/Render/Bool';
import FormatSelect, { RenderFormat } from '@/components/Common/FormatSelect';
import ChannelSelect, {
  RenderChannel,
} from '@/components/Common/ChannelSelect';

import CreateForm from './_createForm';
import { getList as getListSv } from './service';

const ResourceVideo = () => {
  const [searchValues, setSearchValues] = useState<any>({});
  const [update, setUpdate] = useState<boolean>(false);

  const createRef = useRef<ModalFormRef>(null);

  const refresh = () => {
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
      dataIndex: 'sourceName',
      width: 120,
      ellipsis: true,
    },
    {
      title: '分辨率',
      dataIndex: 'formats',
      width: 180,
      render(value) {
        return <RenderFormat value={value} />;
      },
    },
    {
      title: '渠道',
      dataIndex: 'channels',
      width: 180,
      render(value) {
        return <RenderChannel value={value} />;
      },
    },
    {
      title: '展示水印',
      dataIndex: 'watermark',
      width: 88,
      render(value) {
        return <RenderBool value={value} />;
      },
    },
    {
      title: '水印图片',
      dataIndex: 'watermarkImg',
      width: 160,
      ellipsis: true,
      render(value) {
        return <RenderImage value={value} />;
      },
    },
    {
      title: '是否免费',
      dataIndex: 'isFree',
      width: 88,
      render(value) {
        return <RenderBool value={value} />;
      },
    },
    {
      title: '付费开始集数',
      dataIndex: 'payEpisode',
      width: 120,
    },
    {
      title: '单集价格',
      dataIndex: 'price',
      width: 88,
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
      width: 130,
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
                  history.push(
                    `/resource/video/subset?id=${value}&name=${record.sourceName}`,
                  );
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
      <PageHeader title="视频分配" />
      <FormSearch onChange={setSearchValues}>
        <Form.Item label="名称" name="name">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="分辨率" name="format">
          <FormatSelect />
        </Form.Item>
        <Form.Item label="渠道" name="channel">
          <ChannelSelect />
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

export default ResourceVideo;
