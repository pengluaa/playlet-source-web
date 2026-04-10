import React from 'react';
import { Spin } from 'antd';

import styles from './loading.less';

const Loading: React.FC = () => {
  return <Spin fullscreen size="large" description="加载中" />;
};

export default Loading;
