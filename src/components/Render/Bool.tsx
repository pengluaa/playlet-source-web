import { Badge } from 'antd';

export default function RenderBool(props: FormItemChildProps<boolean>) {
  return (
    <Badge
      status={props.value ? 'success' : 'default'}
      text={props.value ? '是' : '否'}
    />
  );
}
