import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { downloadFile } from '@/utils/util';
import { getFileUrl } from '@/libs';

interface Props {
  value: string;
}

const RenderFile = (props: Props) => {
  const download = () => {
    downloadFile(getFileUrl(props.value));
  };

  return (
    <Button
      type="primary"
      size="small"
      disabled={!props.value}
      ghost
      icon={<DownloadOutlined style={{ fontSize: 14 }} />}
      onClick={download}
    >
      下载
    </Button>
  );
};

export default RenderFile;
