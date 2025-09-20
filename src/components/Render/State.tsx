import { Tag } from 'antd';

interface Props extends FormItemChildProps<boolean> {
  trueText?: string;
  falseText?: string;
}

export default function RenderState(props: Props) {
  const open = props.value;
  return (
    <Tag color={open ? 'green' : 'warning'}>
      {open ? props.trueText || '启用' : props.falseText || '禁用'}
    </Tag>
  );
}
