import { getFileUrl } from '@/libs';
import { Image } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  size?: number;
  value?: string;
}
const RenderImage = (props: Props) => {
  const { size = 30, value } = props;
  const [fileSrc, setFileSrc] = useState<string>();

  useEffect(() => {
    setFileSrc(getFileUrl(value));
  }, [value]);

  if (!props.value) {
    return <></>;
  }

  return <Image width={size} height={size} src={fileSrc} preview />;
};

export default RenderImage;
