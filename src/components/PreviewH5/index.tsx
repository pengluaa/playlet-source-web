import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import ImgStatusBar from '@/assets/images/nav_black@2x.png';

interface PreviewH5Props {
  open?: boolean;
  url?: string;
  onClose?: () => void;
}

const PreviewH5 = (props: PreviewH5Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
  }, [props.url]);
  return (
    <Modal
      width={414}
      title={false}
      open={props.open}
      centered={true}
      footer={null}
      closeIcon={false}
      styles={{ body: { padding: 0 }, content: { padding: 0 } }}
      destroyOnClose
      onCancel={props.onClose}
    >
      <div style={{ width: 414, height: 736 }}>
        <div
          style={{
            width: '100%',
            height: 20,
            backgroundImage: `url(${ImgStatusBar})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        ></div>
        <Spin spinning={loading}>
          <iframe
            style={{ width: '100%', height: 716 }}
            frameBorder={0}
            src={props.url}
            onLoad={() => setLoading(false)}
          ></iframe>
        </Spin>
      </div>
    </Modal>
  );
};

export default PreviewH5;
