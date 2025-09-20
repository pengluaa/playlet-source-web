import React, { useRef, useState } from 'react';
import { Form } from 'antd';
import { useSearchParams } from 'umi';

import PageHeader from '@/components/PageHeader';
import FormSearch from '@/components/FormSearch';
import CustomizeTable, {CustomizeTableColumType} from '@/components/Table';
import TableMore from '@/components/TableMoreButton';
import FormatSelect, { RenderFormat } from '@/components/Common/FormatSelect';
import RenderFile from '@/components/Render/File';

import { getList as getListSv, reFormat as reFormatSv } from './service';

const VideoSubset = () => {
  const [searchValues, setSearchValues] = useState<any>({});
  const [update, setUpdate] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');

  const refresh = () => {
    setUpdate(!update);
  };

  const getList = (params: any) => {
    return getListSv({
      id: id,
      ...params,
    });
  };

  const reFormat = async (id: number) => {
    const { error } = await reFormatSv(id);
    if (error) return;
    refresh();
  };

  const columns: CustomizeTableColumType<any>[] = [
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
      render() {
        return name;
      },
    },
    {
      title: '分辨率',
      dataIndex: 'formatId',
      width: 88,
      render(value) {
        return <RenderFormat value={value} />;
      },
    },
    {
      title: '视频',
      dataIndex: 'url',
      width: 88,
      ellipsis: true,
      render(value) {
        return <RenderFile value={value} />;
      },
    },
    {
      title: '转码状态',
      dataIndex: 'statusText',
      width: 88,
    },
    {
      title: '最后转码完成时间',
      dataIndex: 'formatAt',
      timeField: true,
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 88,
      fixed: 'right',
      render(value) {
        return (
          <TableMore
            buttons={[
              {
                id: 1,
                text: '重新转码',
                onClick() {
                  reFormat(value);
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
      <PageHeader title="视频子集" showback />
      <FormSearch onChange={setSearchValues}>
        <Form.Item label="分辨率" name="format">
          <FormatSelect />
        </Form.Item>
      </FormSearch>
      <CustomizeTable
        update={update}
        fetchFn={getList}
        params={searchValues}
        columns={columns}
      />
    </>
  );
};

export default VideoSubset;
