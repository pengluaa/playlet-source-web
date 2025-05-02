import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Space,
  Modal,
  Form,
  Progress,
  message,
  ColProps,
} from 'antd';
import Trigger from 'rc-trigger';
import { DownloadOutlined } from '@ant-design/icons';
import { formatData } from '../ExportData';
import ReadFile from '../ReadFile';
import { exportDocument, getExt } from '@/utils/util';
import styles from './style.less';

import IconDoc from '@/assets/icons/icon_document.png';
import IconExcel from '@/assets/icons/icon_xls.png';
import IconTag from '@/assets/icons/icon-tag.png';

interface Header {
  [key: string]: string;
}

interface Data {
  [key: string]: string | number;
}

type TableDataType = 'aoa' | 'json';

export interface TableData {
  name?: string;
  type?: TableDataType;
  header?: Header;
  data?: Data[] | any[];
}

interface ImportDataProps {
  visible?: boolean;
  width?: number;
  title?: string;
  okText?: string;
  name?: string;
  pagination?: boolean; // 是否分页导入
  pageSize?: number; // 导入分页数默认1000, 当pagination为true&&pageSize大于导入数据时显示进度
  children: React.ReactElement;
  formChildren?: React.ReactElement;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  templateFn?: (values?: any) => Promise<ResponseOk<TableData> | ResponseErr>;
  importFn?: (data: any) => Promise<ResponseOk<any> | ResponseErr>;
  onOkBefore?: (values: any) => any;
  onImportOk?: (res: any) => void;
  onModalClose?: () => void;
  onVisibleChange?: (vis: boolean) => void;
}

interface PopupProps extends ImportDataProps {
  visible?: boolean;
  onVisible?: (visible: boolean) => void;
}

interface Reslut {
  success: number;
  failed: number;
  header?: Header;
  list?: any;
  err_list?: Data[];
  err_msg?: string[];
}

export interface DownloadLogData extends Reslut {
  name?: string;
}

// 下载日志
export const downloadLog = (opt?: DownloadLogData) => {
  const fileName = `${opt?.name || ''}导入错误日志`;
  let values: any = [];
  // 一列数据
  if (opt?.err_msg?.length) {
    opt.err_msg.forEach((msg) => {
      values.push([msg]);
    });
  }
  // 自定义表头
  else if (opt?.header && opt?.err_list?.length) {
    values = formatData({
      data: opt?.err_list ?? [],
      header: opt?.header ?? [],
    });
  }
  exportDocument(values, fileName, true, 'xlsx');
};

// 停止导入
let stopImport: boolean = false;
const Popup: React.FC<PopupProps> = (props) => {
  const {
    visible,
    pagination = true,
    pageSize = 1000,
    templateFn,
    importFn,
    onImportOk,
    onOkBefore,
    onModalClose,
    onVisible,
  } = props;
  const [data, setData] = useState<any[]>([]);
  const [hasFile, setHasFile] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const [fileName, setFileName] = useState<string>();
  const [importError, setImportError] = useState<boolean>();
  const [showProgerss, setShowProgerss] = useState<boolean>();
  const [progerss, setProgress] = useState<number>();
  const [result, setResult] = useState<Reslut>({
    failed: 0,
    success: 0,
  });

  const [form] = Form.useForm();

  const reset = () => {
    setLoading(false);
    setHasFile(false);
    setData([]);
    setResult({
      success: 0,
      failed: 0,
    });
    setFileName('');
    setImportError(false);
    setShowProgerss(false);
    setProgress(0);
  };

  const confirm = async () => {
    return new Promise((resolve, reject) => {
      if (!loading) {
        resolve(true);
        return;
      }
      Modal.confirm({
        title: '提示',
        content: '正在导入中，是否关闭？',
        onOk() {
          resolve(true);
        },
        onCancel() {
          reject();
        },
      });
    });
  };

  const closeModal = async () => {
    try {
      await confirm();
      onVisible?.(false);
      reset();
      form.resetFields();
      onModalClose?.();
      stopImport = true; // 重置导入状态
    } catch (error) {
      //
    }
  };

  const readFileChange = (data: any[], fileName: string) => {
    const ext = getExt(fileName);
    if (!['xls', 'xlsx'].some((item) => item === ext)) {
      message.error('导入文件类型错误');
      return;
    }
    reset();
    setHasFile(true);
    setData(data);
    setFileName(fileName);
  };

  // 导入
  const importHandle = async () => {
    if (!importFn || !data.length) {
      return;
    }

    const importResult: Reslut = {
      failed: 0,
      success: 0,
      err_list: [],
      err_msg: [],
      list: [],
    };

    const run = async (data: any) => {
      const res = await importFn(data);
      if (res.error) {
        setImportError(true);
        return Promise.reject();
      }
      const {
        success = 0,
        failed = 0,
        header,
        list = [],
        err_list = [],
        err_msg = [],
      } = res.data;
      importResult.success += +success;
      importResult.failed += +failed;
      importResult.header = header;
      importResult.list?.push(...list);
      importResult.err_list?.push(...err_list);
      importResult.err_msg?.push(...err_msg);
    };

    try {
      setLoading(true);
      let formValues = await form.validateFields();
      if (onOkBefore) {
        formValues = (await onOkBefore(formValues)) ?? formValues;
      }

      const total = data.length; // 总数
      const importPageSize = pagination ? pageSize : total; // 如果不分页则一页导入
      const totalSize = Math.ceil(total / importPageSize); // 总页数

      // 分页才显示进度
      if (pagination) {
        setShowProgerss(total > importPageSize);
      }

      let pageIndex = 1;
      for (let i = 0; i < totalSize; i++) {
        if (stopImport) {
          return;
        }
        let currentPageSize; // 分页条数
        // 分页情况
        if (pagination) {
          if (totalSize > pageIndex) {
            currentPageSize = importPageSize;
          } else {
            currentPageSize = total - (pageIndex - 1) * importPageSize;
          }
          const progress = +((pageIndex / totalSize) * 100).toFixed(0);
          setProgress(progress);
        }
        // 不分页
        else {
          currentPageSize = total;
        }
        try {
          await run({
            data: data.slice(
              (pageIndex - 1) * importPageSize,
              importPageSize * pageIndex,
            ),
            page: pageIndex,
            ...formValues,
            file_name: fileName,
            page_size: currentPageSize,
          });
          pageIndex++;
        } catch (error) {
          setResult(importResult);
          setLoading(false);
          return;
        }
      }
      setLoading(false);
      stopImport = false;
      onImportOk?.({ data: importResult });
      setResult(importResult);
    } catch (error) {
      setLoading(false);
    }
  };

  // 下载模板
  const downloadTemplate = async () => {
    const fileName = `${props?.name || ''}导入模板`;
    if (!templateFn) return;

    let values = [];
    const { data, error } = await templateFn(form.getFieldsValue());
    if (error) return;
    if (data?.type === 'aoa') {
      values = data.data ?? [];
    } else {
      values = formatData({
        header: data.header ?? [],
        data: data.data ?? [],
      });
    }
    exportDocument(values, data.name || fileName, false, 'xlsx');
  };

  useEffect(() => {
    stopImport = !visible;
  }, [visible]);

  return (
    <Modal
      width={props.width}
      open={visible}
      title={props.title || '导入数据'}
      okText={props.okText || '导入'}
      maskClosable={false}
      confirmLoading={loading}
      onCancel={() => closeModal()}
      onOk={() => importHandle()}
      destroyOnClose
    >
      <Form form={form} labelCol={props.labelCol} wrapperCol={props.wrapperCol}>
        {props?.formChildren}
      </Form>
      <Space className={styles.container} direction="vertical" size={10}>
        <ReadFile
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.xls,.xlsx"
          onChange={readFileChange}
        >
          <div className={styles.wrap}>
            <div className={styles.iconDoc}>
              <img src={hasFile ? IconExcel : IconDoc} alt="" />
            </div>
            <div className={styles.text}>
              {hasFile && (
                <img className={styles.iconTag} src={IconTag} alt="" />
              )}
              <span>{hasFile ? fileName : '点击或拖拽文件到这里上传'}</span>
            </div>
            <div className={styles.tips}>
              {hasFile
                ? '下面提示错误的未导入，未提示则已经成功导入'
                : '导入文件格式可以是xls或xlsx,请根据导入模板填写正确格式'}
            </div>
            {(result.success > 0 || result.failed > 0) && (
              <Row className={styles.result} gutter={30} justify="center">
                <Col>导入成功：{result?.success ?? 0}条</Col>
                <Col>导入失败：{result?.failed ?? 0}条</Col>
              </Row>
            )}
            {result.failed > 0 && (
              <div
                className={styles.errLogBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  downloadLog(result);
                }}
              >
                <DownloadOutlined />
                <span>下载错误日志</span>
              </div>
            )}
          </div>
        </ReadFile>
        <div className={styles.templateBtn} onClick={() => downloadTemplate()}>
          <DownloadOutlined />
          <span>下载模板</span>
        </div>
        {showProgerss && (
          <Progress
            style={{ background: 'white', padding: '0 8px 4px' }}
            status={
              importError
                ? 'exception'
                : progerss === 100
                ? 'success'
                : 'active'
            }
            strokeLinecap="butt"
            percent={progerss}
          />
        )}
      </Space>
    </Modal>
  );
};

const ImportData: React.FC<ImportDataProps> = (props) => {
  const [visible, setVisible] = useState<boolean>();
  const popupProps = {
    ...props,
    visible,
  };

  const onChange = (vis: boolean) => {
    // 只处理显示
    if (vis) {
      // setVisible(vis);
      onVisibleChange(true);
    }
  };

  const onVisibleChange = (vis: boolean) => {
    props.onVisibleChange?.(vis);
    setVisible(vis);
  };

  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  return (
    <Trigger
      popup={<Popup {...popupProps} onVisible={onVisibleChange} />}
      popupVisible={visible}
      action={['click']}
      onPopupVisibleChange={onChange}
    >
      {props.children}
    </Trigger>
  );
};

export default ImportData;
