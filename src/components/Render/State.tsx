import { Tag } from 'antd';

export default function RenderState(props: FormItemChildProps<boolean>) {
  const open = props.value;
  return <Tag color={open ? 'green' : 'warning'}>{open ? '启用' : '禁用'}</Tag>;
}
