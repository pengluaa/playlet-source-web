import React from 'react';
import { Tooltip, Popconfirm } from 'antd';
import { history } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';

import styles from './index.less';

const ToolTip = (props: { render?: React.ReactNode }) => {
  if (!props.render) {
    return null;
  }

  return (
    <Tooltip
      styles={{
        root: {
          maxWidth: 500,
        },
      }}
      placement="bottomLeft"
      title={props.render}
    >
      <QuestionCircleOutlined />
    </Tooltip>
  );
};
const Back = (props: { show?: boolean; confirm?: boolean }) => {
  if (!props.show) {
    return null;
  }

  const goBack = () => {
    history.go(-1);
  };

  if (props.confirm) {
    return (
      <Popconfirm title="确定要返回吗？" onConfirm={goBack}>
        <div className={styles.backWrap}>
          <i className="iconfont icon-icon-back"></i>
        </div>
      </Popconfirm>
    );
  }

  return (
    <div className={styles.backWrap} onClick={goBack}>
      <i className="iconfont icon-icon-back"></i>
    </div>
  );
};

interface PageHeaderProps {
  title?: string;
  showback?: boolean;
  backConfirm?: boolean;
  toolTip?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
  return (
    <div className={styles.head}>
      <Back show={props.showback} confirm={props.backConfirm} />
      <div className={styles.title}>{props.title}</div>
      <ToolTip render={props.toolTip} />
    </div>
  );
};

export default PageHeader;
