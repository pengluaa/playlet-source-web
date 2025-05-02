import React from 'react';
import styles from './index.less';
import { Tooltip, Modal } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';
interface PageHeaderProps {
  title?: string;
  showback?: boolean;
  backConfirm?: boolean;
  toolTip?: React.ReactNode;
}
const PageHeader: React.FC<PageHeaderProps> = (props) => {
  const { title, showback = false, backConfirm = false, toolTip } = props;
  const back = () => {
    if (backConfirm) {
      Modal.confirm({
        content: '确定要返回吗?',
        onOk() {
          history.go(-1);
        },
      });
    } else {
      history.go(-1);
    }
  };
  const showTip = () => {
    if (toolTip) {
      return (
        <Tooltip
          overlayStyle={{ maxWidth: 500 }}
          placement="bottomLeft"
          title={toolTip}
        >
          <QuestionCircleOutlined className={styles.icon} />
        </Tooltip>
      );
    }
    return;
  };
  const showBack = () => {
    if (showback) {
      return (
        <span className={styles.span} onClick={back}>
          <i className="iconfont icon-icon-back"></i>
        </span>
      );
    }
    return;
  };
  return (
    <div className={styles.head}>
      {showBack()}
      <span className={styles.title}>{title}</span>
      {showTip()}
    </div>
  );
};

export default PageHeader;
