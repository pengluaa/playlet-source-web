import React, { useEffect, useState } from 'react';
import { Table, Card, Row, Col, TableColumnType, TableProps } from 'antd';
import { useDebounceEffect } from 'ahooks';
import dayjs from 'dayjs';

interface CustomizeTableProps<T> extends TableProps<T> {
  tableId?: string | number; // table id 唯一标识
  fetchFn?: (values?: any) => Promise<ResponseOk<any> | ResponseErr>;
  params?: any;
  loading?: boolean;
  total?: number;
  filter?: boolean; // 显示列过滤,默认true
  filterThreshold?: number; // 超过多少条显示，默认15
  update?: boolean | number; // 监听update更新数据
  headerContent?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
  noDataToFirst?: boolean; // 如果当前页没有数据返回到第一页 默认false
}

export interface CustomizeTableColumType<T> extends TableColumnType<T> {
  timeField?: boolean;
  timeFormat?: string;
}

const RenderTime = (value: string, format?: string) => {
  if (!value) return value;
  return <>{dayjs(value).format(format || 'YYYY-MM-DD HH:mm:ss')}</>;
};

const CustomizeTable = (props: CustomizeTableProps<any>) => {
  const defaultIndex = 1;
  const defaultSize = 10;
  const {
    fetchFn,
    columns,
    params,
    update,
    loading,
    noDataToFirst = true,
  } = props;
  const [datas, setDatas] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(defaultIndex);
  const [pageSize, setPageSize] = useState<number>(defaultSize);
  const [innerLoading, setiInnerLoading] = useState<boolean>();

  // 获取数据
  const fetchData = async (opts?: any) => {
    try {
      setiInnerLoading(true);
      const res = await fetchFn?.({
        page: pageIndex,
        pageSize: pageSize,
        ...(params ?? {}),
        ...(opts ?? {}),
      });
      setiInnerLoading(false);
      if (!res || res?.error) return;
      const list: any[] = res?.data.list || [];
      const total = props.total ?? res?.data.total;
      // 如果当前页没有数据 && noDataToFirst = true && pageIndex > 1
      if (!list.length && noDataToFirst && pageIndex > 1) {
        onPaginationChange(defaultIndex, pageSize);
      }
      setDatas(list);
      setTotal(total);
    } catch (error) {}
  };

  // 分页变化
  const onPaginationChange = (index: number, size: number) => {
    setPageIndex(index);
    setPageSize(size);
    if (props.pagination) {
      props.pagination?.onChange?.(index, size);
    }
  };

  const getColumns = (
    columns?: CustomizeTableColumType<any>[],
  ): TableColumnType[] => {
    if (!columns) return [];
    return columns.map((item) => ({
      align: 'center',
      render: item.timeField
        ? (value: any) => RenderTime(value, item.timeFormat)
        : item.render,
      ...item,
    }));
  };

  // params变化
  useEffect(() => {
    setPageIndex(defaultIndex);
    setPageSize(defaultSize);
  }, [params]);

  useDebounceEffect(
    () => {
      fetchData();
    },
    [params, update, pageIndex, pageSize],
    { wait: 100 },
  );

  useEffect(() => {
    if (innerLoading !== loading) {
      setiInnerLoading(!!loading);
    }
  }, [loading]);

  // 显示表头
  const showHeader = props.headerContent;

  return (
    <Card
      variant="borderless"
      styles={{
        body: {
          paddingTop: 12,
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 12,
          ...props?.bodyStyle,
        },
      }}
    >
      <Row gutter={16} style={{ marginBottom: showHeader ? 16 : 0 }}>
        <Col flex="auto">{props.headerContent}</Col>
      </Row>
      <Table
        rowKey="id"
        bordered
        dataSource={datas}
        scroll={{ x: '100%' }}
        size="middle"
        {...props}
        columns={getColumns(columns)}
        loading={innerLoading}
        pagination={{
          style: { marginBottom: 4 },
          showQuickJumper: true,
          current: pageIndex,
          pageSize: pageSize,
          total: props.total ?? total,
          showTotal: (total) => `共 ${props.total ?? total} 条`,
          ...props.pagination,
          onChange: onPaginationChange,
        }}
      />
    </Card>
  );
};

export default CustomizeTable;
