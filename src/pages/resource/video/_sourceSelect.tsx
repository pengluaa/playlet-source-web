import { GetProp, Select } from 'antd';
import PagerSelect from '@/components/PagerSelect';
import { getList as getListSv } from '../source/service';

interface Props extends FormItemChildProps<number> {
  mode?: GetProp<typeof Select, 'mode'>;
}

export default function SourceSelect(props: Props) {
  const getOptions = async (parmas: any) => {
    return await getListSv(parmas);
  };

  return (
    <PagerSelect
      showSearch
      optionFilterProp="name"
      disabled={props.disabled}
      mode={props.mode}
      fieldNames={{ label: 'name', value: 'id' }}
      fetchFn={getOptions}
      value={props.value}
      placeholder="请选择"
      onChange={props.onChange}
    />
  );
}
