import React, { useState, useRef, useEffect } from 'react';
import styles from './index.less';

interface FileDragUploadProps {
  children: React.ReactElement;
  onUpload: (value: any) => void;
}

const FileDragUpload: React.FC<FileDragUploadProps> = (props) => {
  const { onUpload } = props;
  const [shouldDrop, setShouleDrop] = useState<boolean>(false);
  const drop = useRef<any>();
  const drag = useRef<any>();
  useEffect(() => {
    drop?.current?.addEventListener('dragover', handleDragOver);
    drop?.current?.addEventListener('dragleave', handleDragLeave);
    drop?.current?.addEventListener('drop', handleDrop);
    drop?.current?.addEventListener('dragenter', handleDragEnder);
    return () => {
      drop?.current?.removeEventListener('dragover', handleDragOver);
      drop?.current?.removeEventListener('dragleave', handleDragLeave);
      drop?.current?.removeEventListener('dragenter', handleDragEnder);
      drop?.current?.removeEventListener('drop', handleDrop);
    };
  }, []);
  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    e.target === drag.current && setShouleDrop(false);
  };
  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const files = [...e.dataTransfer.files];
    if (files.length > 1) {
      alert('只能上传一个文件');
      return;
    }
    onUpload(files);
  };
  const handleDragEnder = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    e.target !== drag.current && setShouleDrop(true);
  };
  return (
    <div ref={drop}>
      <div
        ref={drag}
        className={styles.dragContain}
        style={{ borderColor: shouldDrop ? '#3773FF' : '' }}
      >
        {props.children}
      </div>
    </div>
  );
};

export default FileDragUpload;
