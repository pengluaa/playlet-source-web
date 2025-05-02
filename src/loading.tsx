import React from 'react';
import { Spin } from 'antd';

import styles from './loading.less';
const Loading: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <Spin fullscreen className={styles.spin} size="large" tip="加载中" />
    </div>
  );
};

export default Loading;
