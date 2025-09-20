import { GetProp, Select, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getProjects as getProjectsSv } from './service';

interface Props extends FormItemChildProps<number> {
  mode?: GetProp<typeof Select, 'mode'>;
  showDir?: boolean;
}

export default function ProjectSelect(props: Props) {
  const [options, setOptions] = useState<any[]>();

  const getList = async () => {
    const { error, data } = await getProjectsSv();
    if (error) return;
    data.forEach((item) => {
      item.folder = item.dir.split('/').pop();
    });
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
          <Typography.Text hidden={!props.showDir} type="secondary">
            [{option.data.folder}]
          </Typography.Text>
        </Space>
      )}
      placeholder="请选择"
      onChange={props.onChange}
    />
  );
}
