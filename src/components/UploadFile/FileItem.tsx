import { useEffect, useState } from 'react';
import { Col, Image, Popconfirm, Progress, Button, Space, Flex } from 'antd';

import IconVideo from '@/assets/icons/icon_video@2x.png';
import IconWord from '@/assets/icons/icon_word@2x.png';
import IconXls from '@/assets/icons/icon_xls@2x.png';
import IconPdf from '@/assets/icons/icon_pdf@2x.png';
import IconFile from '@/assets/icons/icon_file@2x.png';
import IconImage from '@/assets/icons/icon_image@2x.png';
import IconChecked from '@/assets/icons/icon_checked@2x.png';
import IconFail from '@/assets/icons/icon_fail@2x.png';

import { getExt, isImageUrl, isVideoUrl, previewFile } from '@/utils/util';
import upload, { UploadFile } from '@/utils/upload';
import { getFileUrl } from '@/libs';
import styles from './style.less';

interface Props {
  file: FileInfo;
  dir?: string;
  disabled?: boolean;
  onDelete?: () => void;
  onOk?: (fileUrl: string) => void;
}

const FileIcon = (props: { url?: string }) => {
  const url = props.url;
  const ext = getExt(props.url);
  let icon = null;

  if (isImageUrl(url)) {
    icon = IconImage;
  } else if (isVideoUrl(url)) {
    icon = IconVideo;
  } else if (ext === 'pdf') {
    icon = IconPdf;
  } else if (ext === 'docx' || ext === 'doc') {
    icon = IconWord;
  } else if (ext === 'xlsx' || ext === 'xls') {
    icon = IconXls;
  } else {
    icon = IconFile;
  }
  return <img src={icon} className={styles.iconVideo} />;
};

const FileItem = (props: Props) => {
  const [file, setFile] = useState<FileInfo>(props.file);
  const [xhr, setXhr] = useState<XMLHttpRequest>();

  const deleteFile = () => {
    props.onDelete?.();
  };

  const cancleUpload = () => {
    xhr?.abort();
    deleteFile();
  };

  const reUpload = () => {
    uploadFile();
  };

  const preview = (url?: string) => {    
    if (!url) return;
    previewFile(getFileUrl(url));
  };

  const uploadFile = (): void => {
    // 上传过或者正在上传中，无需上传
    if (file.url || file.status === 'uploading' || file.status === 'done') {
      return;
    }

    // 文件上传默认20进度
    file.status = 'uploading';
    file.progress = 20;
    const uFile: UploadFile = {
      id: file.uid,
      file: file.file,
      dir: props.dir,
      onprogress(percent) {
        file.progress = percent;
        setFile({ ...file });
      },
      onSuccess(res) {
        file.status = 'done';
        file.url = res.path;
        setFile({ ...file });
        props.onOk?.(file.url);
      },
      onFail() {
        file.status = 'error';
        setFile({ ...file });
      },
    };
    const xhr = upload(uFile);
    setXhr(xhr);
  };

  useEffect(() => {
    uploadFile();
  }, []);

  return (
    <>
      <Col style={{ flex: 1 }}>
        <div className={styles.name}>
          <FileIcon url={file.url || file.name} />
          <span className="ellipsis-1">{file.name}</span>
        </div>
      </Col>
      <Col flex="120px">
        <Flex style={{ height: '100%' }} align="center" justify="flex-end">
          <div className={styles.progress}>
            {file.status === 'done' && (
              <Image src={IconChecked} width={16} preview={false} />
            )}
            {file.status === 'error' && (
              <Image src={IconFail} width={16} preview={false} />
            )}
            {file.status === 'uploading' && (
              <Progress
                style={{ width: 66 }}
                size={4}
                status="active"
                strokeColor="#3361FF"
                trailColor="#DDDDDD"
                percent={file.progress}
              />
            )}
          </div>
          <div className={styles.tools}>
            {file.status === 'done' && (
              <>
                <Popconfirm
                  title="是否确认删除？"
                  onConfirm={() => deleteFile()}
                >
                  <Button disabled={props.disabled} size="small" type="link">
                    删除
                  </Button>
                </Popconfirm>
                <Button
                  disabled={props.disabled}
                  size="small"
                  type="link"
                  onClick={() => preview(props.file.url)}
                >
                  查看
                </Button>
              </>
            )}
            {file.status === 'uploading' && (
              <Button type="link" onClick={() => cancleUpload()}>
                取消上传
              </Button>
            )}
            {file.status === 'error' && (
              <>
                <Button size="small" type="link" onClick={reUpload}>
                  重新上传
                </Button>
                <Button
                  size="small"
                  disabled={props.disabled}
                  type="link"
                  onClick={() => deleteFile()}
                >
                  删除
                </Button>
              </>
            )}
          </div>
        </Flex>
      </Col>
    </>
  );
};

export default FileItem;
