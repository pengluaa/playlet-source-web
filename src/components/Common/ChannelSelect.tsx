import { useContext, useEffect, useState } from 'react';
import { GetProp, Select, Tag } from 'antd';
import MainContext from '@/mainContext';

interface Props extends FormItemChildProps<number[]> {
  mode?: GetProp<typeof Select, 'mode'>;
}

export default function ChannelSelect(props: Props) {
  const { channels } = useContext(MainContext);

  return (
    <Select
      disabled={props.disabled}
      mode={props.mode}
      options={channels}
      fieldNames={{ label: 'name', value: 'id' }}
      value={props.value}
      placeholder="请选择"
      onChange={props.onChange}
    />
  );
}

interface RenderChannelProps {
  value: number[];
}
export function RenderChannel(props: RenderChannelProps) {
  const { channels } = useContext(MainContext);
  const ids = [];
  if (props.value instanceof Array) {
    ids.push(...props.value)
  } else {
    ids.push(props.value)
  }

  return (
    <>
      {ids.map((channelId) => (
        <Tag key={channelId} color="blue">
          {channels.find((option) => option.id === channelId)?.name}
        </Tag>
      ))}
    </>
  );
}
