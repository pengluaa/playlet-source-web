import React from 'react';
import { Image } from 'antd';
import { getFileUrl } from '@/libs';

export interface PreviewProps {
  visible?: boolean;
  current?: number;
  list: string[];
  onVisibleChange?: (vis: boolean) => void;
}
const Preview: React.FC<PreviewProps> = (props) => {
  const { visible, current = 0, onVisibleChange } = props;
  return (
    <div style={{ display: 'none' }}>
      <Image.PreviewGroup preview={{ visible, onVisibleChange, current }}>
        {props.list.map((url) => {
          return <Image src={getFileUrl(url)} key={url}></Image>;
        })}
      </Image.PreviewGroup>
    </div>
  );
};

export default Preview;
