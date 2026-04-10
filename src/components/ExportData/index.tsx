import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Radio,
  Progress,
  message,
} from 'antd';
import Trigger from 'rc-trigger';
import { exportDocument } from '@/utils/util';
import dayjs from 'dayjs';

type extType = 'xlsx' | 'csv';

interface ExportDataProps {
  disabled?: boolean;
  children: React.ReactElement;
  formChildren?: React.ReactElement;
  name?: string;
  limit?: number;
  ext?: extType;
  hideLimit?: boolean;
  hideExt?: boolean;
  exportFn?: (values: ListParams) => Promise<ResponseOk<any> | ResponseErr>;
  params?: any;
  timeField?: string; // 时间筛选字段默认time
}

interface HeaderType {
  key: string;
  name: string;
  tips?: string;
}

interface FormatData {
  header: object | HeaderType[];
  data: any[];
}

interface PopupProps extends ExportDataProps {
  visible?: boolean;
  onVisible?: (visible: boolean) => void;
}

// 数据转换
export const formatData = (data: FormatData): any[] => {
  let headerKeys: string[] = [];
  let headerValues = [];
  if (Array.isArray(data.header)) {
    headerKeys = data.header.map((item) => item.key);
    headerValues = data.header.map((item) => item.name);
  } else {
    headerKeys = Object.keys(data.header);
    headerValues = Object.values(data.header);
  }

  const values = data.data;
  const arr = [];

  arr.push(headerValues);
  for (const item of values) {
    const row = [];
    for (const key of headerKeys) {
      row.push(`${item[key] ?? ''}`);
    }
    arr.push(row);
  }
  return arr;
};

// 停止下载
let stopDownload: boolean = false;

const Popup = (props: PopupProps) => {
  const {
    exportFn,
    params = {},
    hideLimit = false,
    hideExt = false,
    visible,
    onVisible,
  } = props;
  const initialValues = {
    ext: 'csv',
    _timeField: props.timeField ?? 'time',
    ...props,
  };
  const [download, setDownload] = useState<boolean>();
  const [progress, setProgress] = useState<number>();
  const [form] = Form.useForm();

  const reset = () => {
    form.resetFields();
    setProgress(0);
    setDownload(false);
  };

  const downloadData = () => {
    let pageIndex = 1;
    let pageSize = 1000;
    let header = {};
    const tableData: any[] = [];

    setDownload(true);

    const done = () => {
      // 停止下载
      if (stopDownload) {
        return;
      }
      const { name, ext, limit, _timeField } = form.getFieldsValue();
      const values = formatData({
        data: limit > 0 ? tableData.slice(0, limit) : tableData,
        header: header,
      });

      let filename = name || props.name || '';
      let suffix = '';

      if (props.params[_timeField]) {
        const [start, end] = props.params[_timeField].split('~');
        if (start && end) {
          suffix = `${start}_${end}`;
        }
      }

      if (!suffix) {
        suffix = dayjs().format('YYYY-MM-DD');
      }

      exportDocument(values, `${filename}_${suffix}`, false, ext);
    };

    // 获取数据
    const fetchData = async () => {
      if (!exportFn) {
        console.error('请传入exportFn');
        return;
      }
      const values = form.getFieldsValue();
      const { limit } = values;
      delete values?.name; // 删除name防止筛选字段冲突

      const { error, data } = await exportFn({
        ...values,
        ...params,
        pageNo: pageIndex,
        pageSize: pageSize,
      });
      // error
      if (error) return;
      // 停止下载
      if (stopDownload) {
        return;
      }

      header = data.header;
      const pushData = data.data || data.list || [];
      tableData.push(...pushData);

      if (!data.last_page) {
        data.last_page = Math.ceil(data.total / pageSize)
      }
      // 进度
      let progress = pageIndex / data.last_page;
      // 如果限制条数
      if (limit > 0 && progress < 1) {
        progress = tableData.length / limit;
        if (progress > 1) {
          progress = 1;
        }
      }
      progress = +(progress * 100).toFixed(2);
      if (progress < 100 && data.last_page > 0) {
        setProgress(progress);
        pageIndex++;
        fetchData();
      } else {
        setProgress(100);
        done();
      }
    };
    fetchData();
  };

  const closeModal = () => {
    reset();
    onVisible?.(false);
  };

  const Footer = () => {
    if (progress === 100) {
      return (
        <Button type="primary" onClick={closeModal}>
          完成
        </Button>
      );
    }
    if (download) {
      return <Button onClick={closeModal}>取消</Button>;
    }
    return (
      <>
        <Button onClick={closeModal}>取消</Button>
        <Button type="primary" onClick={downloadData}>
          导出
        </Button>
      </>
    );
  };

  useEffect(() => {
    setDownload(false);
    setProgress(0);
    stopDownload = !visible;
  }, [visible]);

  return (
    <>
      <Modal
        visible={visible}
        title="导出数据"
        onOk={() => setDownload(true)}
        onCancel={() => closeModal()}
        mask={{closable: false}}
        destroyOnHidden
        footer={<Footer />}
      >
        <Form labelCol={{ span: 6 }} initialValues={initialValues} form={form}>
          <Form.Item noStyle hidden={download}>
            {/* 文件导出文件名需要 */}
            <Form.Item label="时间字段" name="_timeField" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="文件名" name="name">
              <Input placeholder={props.name || '请输入'} allowClear />
            </Form.Item>
            <Form.Item
              label="导出条数"
              name="limit"
              help="不填写为导出全部数据"
              hidden={hideLimit}
            >
              <InputNumber placeholder="请输入" min={1} max={1e6} />
            </Form.Item>
            {/* formChild */}
            {props?.formChildren}
            <Form.Item label="导出文件格式" name="ext" hidden={hideExt}>
              <Radio.Group>
                <Radio value="xlsx">xlsx</Radio>
                <Radio value="csv">csv</Radio>
              </Radio.Group>
            </Form.Item>
          </Form.Item>
          <Form.Item hidden={!download} style={{ textAlign: 'center' }}>
            <Progress
              type="circle"
              percent={progress}
              status={progress === 100 ? 'success' : 'active'}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const ExportData: React.FC<ExportDataProps> = (props) => {
  const [visible, setVisible] = useState<boolean>();
  const popupProps = {
    ...props,
    visible,
  };

  const onPopupVisibleChange = (visible: boolean) => {
    if (!props.disabled) {
      setVisible(visible);
    }
  };

  return (
    <Trigger
      popup={<Popup {...popupProps} onVisible={setVisible} />}
      popupVisible={visible}
      action={['click']}
      onPopupVisibleChange={onPopupVisibleChange}
    >
      {props.children}
    </Trigger>
  );
};

export default ExportData;
