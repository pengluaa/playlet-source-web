import { Space, Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

/** 筛选条件过滤 */
export const TreeItem = (props: any) => {
  const { onChange, options } = props;

  const defaultValue = options.map((_: any, index: number) => index);

  const checkChange = (values: any[]) => {
    onChange?.(values);
  };

  return (
    <CheckboxGroup onChange={checkChange} defaultValue={defaultValue}>
      <Space orientation="vertical">
        {options?.map((item: any, index: number) => (
          <Checkbox key={index} value={index}>
            {item.props?.label}
          </Checkbox>
        ))}
      </Space>
    </CheckboxGroup>
  );
};
