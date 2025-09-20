import { Typography, GetProp } from 'antd';
import dayjs from 'dayjs';

interface Props extends FormItemChildProps<string> {
  placeholderText?: string;
  timeField?: boolean;
  timeFormat?: string;
  type?: GetProp<typeof Typography.Text, 'type'>;
}

export default function RenderText(props: Props) {
  let text = '';
  if (props.value) {
    text = props.timeField
      ? dayjs(props.value).format(props.timeFormat || 'YYYY-MM-DD HH:mm:ss')
      : props.value;
  } else {
    text = props.placeholderText ?? '-';
  }
  return (
    <Typography.Text type={props.type ?? 'secondary'}>{text}</Typography.Text>
  );
}
