import { Select, Tag, TagProps } from 'antd';

type ServerStatus =
  | 'OK' // ok
  | 'PENDING' // 状态等待中
  | 'AUTH_ERR' // 认证错误
  | 'TIMEOUT' // 超时
  | 'FAIL'; // fail'
interface StatusItem {
  text: string;
  color: TagProps['color'];
}

const statusMap: { [keyof in ServerStatus]: StatusItem } = {
  OK: {
    text: '正常',
    color: 'success',
  },
  PENDING: {
    text: '等待中',
    color: 'cyan',
  },
  AUTH_ERR: {
    text: '连接认证错误',
    color: 'red-inverse',
  },
  TIMEOUT: {
    text: '连接超时',
    color: 'red-inverse',
  },

  FAIL: {
    text: '连接失败',
    color: 'error',
  },
};

export const getServerLabelByStauts = (status: ServerStatus | null) => {
  if (!status) return;
  return statusMap[status].text;
};

export const ServerStatusTag = (props: { value: ServerStatus | null }) => {
  const { value } = props;
  if (!value) return;
  return <Tag color={statusMap[value].color}>{statusMap[value].text}</Tag>;
};
