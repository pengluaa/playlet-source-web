import { useContext, useEffect, useState } from 'react';
import { GetProp, Select, Tag } from 'antd';
import { getFormats as getFormatsSv } from '@/service';
import MainContext from '@/mainContext';

interface Props extends FormItemChildProps<number[]> {
  mode?: GetProp<typeof Select, 'mode'>;
}

export default function FormatSelect(props: Props) {
  const { formats } = useContext(MainContext);

  return (
    <Select
      disabled={props.disabled}
      mode={props.mode}
      options={formats}
      fieldNames={{ label: 'name', value: 'id' }}
      value={props.value}
      placeholder="请选择"
      onChange={props.onChange}
    />
  );
}

interface RenderFormatProps {
  value: number[];
}
export function RenderFormat(props: RenderFormatProps) {
  const { formats } = useContext(MainContext);
  const ids = [];
  if (props.value instanceof Array) {
    ids.push(...props.value);
  } else {
    ids.push(props.value);
  }
  return (
    <>
      {ids.map((formatId) => (
        <Tag key={formatId} color="blue">
          {formats.find((option) => option.id === formatId)?.name}
        </Tag>
      ))}
    </>
  );
}
