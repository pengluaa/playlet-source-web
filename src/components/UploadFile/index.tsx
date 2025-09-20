import { useEffect, useState } from 'react';
import { Row, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import BaseUpload from '../Upload/index';
import { getRandomString } from '@/utils/util';
import styles from './style.less';
import FileItem from './FileItem';

interface UploadFileProps {
  value?: string[] | string;
  disabled?: boolean;
  hidden?: boolean;
  text?: string;
  multiple?: boolean;
  showFile?: boolean;
  accept?: string;
  max?: number; // 最多上传
  maxSize?: number; // 文件大小
  dir?: string;
  onChange?: (values?: string[] | string) => void;
}

const UploadFile = (props: UploadFileProps) => {
  const {
    accept = '*',
    multiple = false,
    showFile = true,
    max = -1,
    onChange,
  } = props;
  const [fileList, setFileList] = useState<FileInfo[]>([]);

  const emitChange = (files: FileInfo[]) => {
    const values: string[] = files
      .map((file) => file.url ?? '')
      .filter((url) => !!url);

    if (multiple) {
      onChange?.(values.length ? values : void 0);
    } else {
      onChange?.(values[0]);
    }
  };

  // 显示添加图片按钮
  const hideUpload = (): boolean => {
    if (props.hidden) {
      return true;
    }
    if (!multiple && fileList.length) {
      return true;
    }
    if (max !== -1 && fileList.length >= max) {
      return true;
    }
    return false;
  };

  // 上传max
  const uploadMax = (): number | undefined => {
    if (!multiple) {
      return 1;
    }
    if (max !== -1) {
      return max - fileList.length;
    }
    return undefined;
  };

  const onFileChange = (files: FileInfo[]) => {
    fileList.push(...files);
    setFileList([...fileList]);
  };

  const onDelete = (index: number) => {
    fileList.splice(index, 1);
    setFileList([...fileList]);
    emitChange([...fileList]);
  };

  const onSuccess = (index: number, url: string) => {
    fileList[index].url = url;
    setFileList([...fileList]);
    emitChange([...fileList]);
  };

  useEffect(() => {
    const values: string[] = [];
    if (typeof props.value === 'string') {
      values.push(props.value);
    } else {
      values.push(...(props.value ?? []));
    }
    const list: FileInfo[] = values
      .filter((val) => !!val)
      .map((url) => ({
        uid: getRandomString(),
        name: url,
        url: url,
        size: 0,
        ext: '',
        status: 'done',
      }));
    setFileList(list);
  }, [props.value]);

  return (
    <>
      {showFile &&
        fileList.map((file, index) => (
          <Row key={file.uid} className={styles.uploadItem} gutter={0}>
            <FileItem
              dir={props.dir}
              file={file}
              disabled={props.disabled}
              onDelete={() => onDelete(index)}
              onOk={(url) => onSuccess(index, url)}
            />
          </Row>
        ))}
      <BaseUpload
        disabled={props.disabled}
        accept={accept}
        max={uploadMax()}
        showUpload={!hideUpload()}
        maxSize={props.maxSize}
        onChange={onFileChange}
      >
        <Button disabled={props.disabled} icon={<UploadOutlined />}>
          {props.text ?? '上传'}
        </Button>
      </BaseUpload>
    </>
  );
};

export default UploadFile;
