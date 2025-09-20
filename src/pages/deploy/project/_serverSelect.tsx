import { GetProp, Select, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getServers as getServersSv } from './service';
import { getServerLabelByStauts } from '@/pages/system/server/_serverStatus';

interface Props extends FormItemChildProps<number> {
  mode?: GetProp<typeof Select, 'mode'>;
}

export default function ServerSelect(props: Props) {
  const [options, setOptions] = useState<any[]>();

  const getList = async () => {
    const { error, data } = await getServersSv();
    if (error) return;
    setOptions(data);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Select
      showSearch
      optionFilterProp="name"
      disabled={props.disabled}
      mode={props.mode}
      value={props.value}
      options={options}
      fieldNames={{ label: 'name', value: 'id' }}
      optionRender={(option) => (
        <Space>
          <Typography.Text>{option.label}</Typography.Text>
          <Typography.Text type="secondary">
            【{getServerLabelByStauts(option.data.status)}】
          </Typography.Text>
        </Space>
      )}
      placeholder="请选择"
      onChange={props.onChange}
    />
  );
}
