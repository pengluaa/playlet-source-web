import { Select, Tag, TagProps } from 'antd';

export type DeployStatus =
  | 'REVIEW' // 审核
  | 'DEPLOY' // 部署中
  | 'CONNECT_AUTH_ERR' // 连接认证错误
  | 'CONNECT_TIMEOUT' // 连接超时
  | 'CONNECT_FAIL' // 连接失败
  | 'SUCCESS' // 成功
  | 'REJECT' // 拒绝
  | 'FAIL'; // 失败

interface DeployStatusItem {
  text: string;
  color: TagProps['color'];
}
interface DeployStatusOption extends DeployStatusItem {
  id: DeployStatus;
}

const statusMap: { [keyof in DeployStatus]: DeployStatusItem } = {
  REVIEW: {
    text: '审核中',
    color: 'blue',
  },
  DEPLOY: {
    text: '部署中',
    color: 'cyan',
  },
  CONNECT_AUTH_ERR: {
    text: '连接认证错误',
    color: 'red',
  },
  CONNECT_TIMEOUT: {
    text: '连接超时',
    color: 'red',
  },
  CONNECT_FAIL: {
    text: '连接失败',
    color: 'red',
  },
  SUCCESS: {
    text: '部署成功',
    color: 'success',
  },
  REJECT: {
    text: '审核拒绝',
    color: 'red',
  },
  FAIL: {
    text: '部署失败',
    color: 'error',
  },
};

const statusOptions: DeployStatusOption[] = Object.keys(statusMap).map((k) => {
  const id = k as DeployStatus;
  return {
    id: id,
    ...statusMap[id],
  };
});

export const DeployStatusTag = (props: { value: DeployStatus | null }) => {
  const { value } = props;
  if (!value) return;
  return <Tag color={statusMap[value].color} variant='solid'>{statusMap[value].text}</Tag>;
};

export const DeployStatusSelect = (props: FormItemChildProps<string>) => {
  return (
    <Select
      allowClear
      value={props.value}
      fieldNames={{ label: 'text', value: 'id' }}
      options={statusOptions}
      placeholder="请选择"
      onChange={props.onChange}
    />
  );
};
