import React, { useEffect, useState } from 'react';
import { Space, Button, Progress, Tooltip } from 'antd';

import Preview from '../Preview';
import BaseUpload from '../Upload/index';
import upload, { UploadFile } from '@/utils/upload';

import IconReplace from '@/assets/icons/icon_cir_replace@2x.png';
import IconPreview from '@/assets/icons/icon_cir_preview@2x.png';
import IconDelete from '@/assets/icons/icon_cir_delete@2x.png';

import styles from './style.less';
import { getRandomString, isImageUrl } from '@/utils/util';
import { getFileUrl } from '@/libs';

interface UploadImageProps {
  children?: React.ReactNode;
  value?: string[] | string;
  disabled?: boolean;
  hidden?: boolean;
  showFile?: boolean;
  multiple?: boolean; // 多文件 默认true
  accept?: string;
  max?: number; // 最多上传
  maxSize?: number; // 文件大小
  uploadStart?: () => void; // 开始上传
  uploadFinish?: () => void; // 上传完成
  onChange?: (values?: string[] | string) => void;
}

interface IconToolProps {
  disabled?: boolean;
  title: string;
  icon: string;
  onClick?: () => void;
}

const IconTool = (props: IconToolProps) => {
  return (
    <Tooltip title={props.title} color="#454864" placement="top">
      <Button
        type="text"
        disabled={props.disabled}
        style={{ margin: 0, padding: 0 }}
      >
        <div
          className={styles.iconTool}
          style={{ backgroundImage: `url(${props.icon})` }}
          onClick={props.onClick}
        ></div>
      </Button>
    </Tooltip>
  );
};

const UploadImage: React.FC<UploadImageProps> = (props) => {
  const {
    onChange,
    accept = 'image/*',
    multiple = true,
    showFile = true,
    max = -1,
  } = props;
  const [fileList, setFileList] = useState<FileInfo[]>([]);
  const [previewState, setPreviewState] = useState<boolean>();
  const [previewCurrent, setPreviewCurrent] = useState<number>();

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

  const onFileChange = (files: FileInfo[], replace?: boolean): void => {
    files = files.filter((file) => isImageUrl(file.name));
    if (replace) {
      fileList.length = 0;
      fileList.push(...files);
    } else {
      files = files.slice(0, uploadMax() ?? files.length);
      fileList.push(...files);
    }

    const total = fileList.length;
    let sum = 0;

    const checkUpload = () => {
      setFileList([...fileList]);
      sum++;
      if (total === sum) {
        props.uploadFinish?.();
        emitChange([...fileList]);
      }
    };

    for (const file of fileList) {
      // 上传过或者正在上传中，无需上传
      if (file.url || file.status === 'uploading' || file.status === 'done') {
        sum++;
        continue;
      }

      // 图片上传默认30进度
      file.status = 'uploading';
      file.progress = 30;
      const uFile: UploadFile = {
        id: file.uid,
        name: file.name,
        size: file.size,
        file: file.file,
        onSuccess(res) {
          file.status = 'done';
          file.url = res.path;
          checkUpload();
        },
        onFail() {
          file.status = 'error';
          checkUpload();
        },
      };
      props.uploadStart?.();
      upload(uFile);
    }
    setFileList([...fileList]);
  };

  /**
   * @description 图片替换
   */
  const onReplace = (file: FileInfo, index: number): void => {
    fileList.splice(index, 1, file);
    onFileChange([...fileList], true);
  };

  /**
   * @description 图片预览
   */
  const onPreview = (current: number): void => {
    setPreviewCurrent(current);
    setPreviewState(true);
  };
  /**
   * @description 删除
   */
  const onDelete = (index: number) => {
    const reFileList = [...fileList];
    reFileList.splice(index, 1);
    setFileList(reFileList);
    emitChange(reFileList);
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
      <Preview
        visible={previewState}
        current={previewCurrent}
        list={fileList.map((item) => item.tempUrl ?? item.url ?? '')}
        onVisibleChange={(vis) => setPreviewState(vis)}
      />
      <Space size={16} wrap>
        {showFile &&
          fileList.map((item, index) => (
            <div
              className={styles.imageItem}
              key={item.tempUrl || item.url || item.uid}
            >
              <img
                className={styles.fileImage}
                src={item.tempUrl ?? getFileUrl(item.url)}
              />
              {/* 操作按钮 */}
              {item.status === 'done' && (
                <Space className={styles.tools} size={8}>
                  <BaseUpload
                    disabled={props.disabled}
                    accept={accept}
                    max={1}
                    maxSize={props.maxSize}
                    onChange={(files) => onReplace(files[0], index)}
                  >
                    <IconTool
                      disabled={props.disabled}
                      title="替换"
                      icon={IconReplace}
                    />
                  </BaseUpload>
                  <IconTool
                    title="预览"
                    disabled={false}
                    icon={IconPreview}
                    onClick={() => onPreview(index)}
                  />
                  <IconTool
                    title="删除"
                    disabled={props.disabled}
                    icon={IconDelete}
                    onClick={() => onDelete(index)}
                  />
                </Space>
              )}
              {/* 上传进度 */}
              {item.status === 'uploading' && (
                <div className={styles.uploadProgressBox}>
                  <Progress
                    className={styles.uploadProgress}
                    status="active"
                    strokeColor="#3361FF"
                    size={4}
                    showInfo={false}
                    percent={item.progress}
                  />
                </div>
              )}
            </div>
          ))}
        <BaseUpload
          accept={accept}
          max={uploadMax()}
          maxSize={props.maxSize}
          showUpload={!hideUpload()}
          onChange={(files) => onFileChange(files)}
        >
          {props.children ?? (
            <Button disabled={props.disabled} className={styles.uploadBtn}>
              <i className="icon-add iconfont"></i>
              <div>上传图片</div>
            </Button>
          )}
        </BaseUpload>
      </Space>
    </>
  );
};

export default UploadImage;
