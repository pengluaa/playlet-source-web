import React, { useRef } from 'react';
import { message } from 'antd';

import { getExt, getRandomString } from '@/utils/util';
import { stopPropagation } from '@/utils/event';
import styles from './upload.less';

const UploadBase: React.FC<React.PropsWithChildren<UploadProps>> = (props) => {
  const { max = -1, maxSize = -1, accept = '*' } = props;
  const uploadRef = useRef<HTMLInputElement>(null);
  const multiple: boolean = max > 1 || max === -1;

  /**
   * @description 获取文件信息
   */
  const getFileInfo = (file: File): FileInfo => {
    return {
      uid: getRandomString(),
      name: file.name,
      size: file.size,
      ext: getExt(file.name),
      url: '',
      tempUrl: URL.createObjectURL(file),
      file: file,
      status: 'default',
    };
  };

  const onFileChange = (e: any): void => {
    const files: FileInfo[] = [];
    const targetFiles: any[] = e.target.files;
    const len = e.target.files.length;

    try {
      for (let i = 0; i < len; i++) {
        const file = targetFiles[i];
        const key = getRandomString();
        const fileInfo = getFileInfo(file);
        if (maxSize === -1 || maxSize > (fileInfo?.size ?? 0)) {
          files.push(fileInfo);
        } else {
          message.warning({
            key: key,
            content: fileInfo.name + '文件大小超出限制',
          });
        }
      }
    } catch (error) {
      // code
    }
    if (!files.length) {
      return;
    }
    // 文件个数超出限制
    if (max > 0) {
      files.splice(max, files.length);
    }
    props.onChange && props.onChange(files);
  };

  const className = [styles.baseUpload];
  if (props.disabled) {
    className.push(styles.baseUploadDisabled);
  }

  if (props.showUpload === false) {
    return <></>;
  }

  return (
    <div
      style={props.style}
      className={className.join(' ')}
      onClick={(e) => {
        !props.disabled && uploadRef.current?.click();
      }}
    >
      <input
        style={{ display: 'none' }}
        type="file"
        ref={uploadRef}
        multiple={multiple}
        accept={accept}
        onClick={(e) => stopPropagation(e)}
        onChange={onFileChange}
      />
      {props.children}
    </div>
  );
};

export default UploadBase;
