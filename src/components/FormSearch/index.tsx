import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Space,
  Popover,
  FormInstance,
} from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { TreeItem } from './component';
import { arrTimeToString, formatTime } from '@/utils/util';

import styles from './style.less';
import { useDebounceFn } from 'ahooks';
import dayjs from 'dayjs';

type ColLenType = number | { xxl: number; xl: number; sm: number };

interface FormSearchProps {
  save?: boolean; // 保存筛选参数
  colLen?: ColLenType;
  formKey?: string; // 保存筛选参数key 默认location.pathname
  form?: FormInstance;
  initialValues?: any; // 搜索表单默认值
  timeFileds?: string[]; // 格式化时间字段 eg: ['add_time']
  timeFormat?: string; // 默认 YYYY-MM-DD
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  children?: any;
  onSearch?: (values: any) => void;
  onReset?: () => void;
  onChange?: (values?: any) => void;
}

interface FormListType {
  showIndex?: number;
  hidden?: boolean;
  children?: any;
}

const XXL = 1600;
const XL = 1200;
const searchValueMap = new Map<string, any>(); // 搜索值map
const expandMap = new Map<string, boolean>(); // 展开map

const FormSearch: React.FC<FormSearchProps> = (props) => {
  const {
    onReset,
    onSearch,
    onChange,
    save = false,
    formKey = location.pathname,
  } = props;

  // const colSpan = { xxl: { span: 6 }, xl: { span: 8 }, sm: { span: 12 } };

  let children: any[] =
    props.children?.length > 1 ? props.children : [props.children];

  // 过滤隐藏内容
  children = children.filter((item) => {
    if (item === false) {
      return false;
    }
    if (item.props.hidden === true) {
      return false;
    }
    return true;
  });

  let realChildLen = children.length;
  const [expand, setExpand] = useState<boolean>(!!expandMap.get(formKey));
  const [colLen, setColLen] = useState<number>(4); // 每列个数
  const [showLen, setShowLen] = useState<number>(realChildLen); // 显示个数
  const [showKeys, setShowKeys] = useState<number[]>(); // 勾选筛选
  const [formList, setFormList] = useState<FormListType[]>([]); // form list
  const [colSpan, setColSpan] = useState<any>();
  const [offset, setOffset] = useState<number>();

  const form = props.form ?? Form.useForm()[0]; // form
  const showFilter = realChildLen > 12; // 筛选条件
  const showExpand = showLen >= colLen; // 显示展开按钮

  // 计算offset
  const calcOffset = (): void => {
    let offset = 0;
    const span = 24 / colLen;
    if (showLen >= colLen && !expand) {
      offset = colLen - 1;
    } else {
      offset = showLen % colLen;
    }
    const val = (colLen - offset - 1) * span;
    setOffset(val);
  };
  // 窗口变化
  const { run: onDebounceResize } = useDebounceFn(
    (initColSpan) => {
      const VW = window.innerWidth;
      if (VW >= XXL) {
        setColLen(24 / initColSpan.xxl.span);
      } else if (VW > XL) {
        setColLen(24 / initColSpan.xl.span);
      } else {
        setColLen(24 / initColSpan.sm.span);
      }
    },
    { wait: 100 },
  );

  // 筛选字段
  const handleTreeChange = (values: number[]) => {
    setShowLen(values.length);
    setShowKeys(values);
  };

  // 重置
  const handleReset = () => {
    onReset?.();
    form.resetFields();
    form.setFieldsValue(props.initialValues);
    handleSubmit({ ...props.initialValues }, true);
    if (save) {
      searchValueMap.delete(formKey);
    }
  };

  // form list
  const handleFormList = () => {
    const formList: FormListType[] = [];
    let i = 0;

    children.map((item: any, index: number) => {
      const checked = showKeys?.some((k) => k === index) ?? true;
      let hidden = true;
      if (expand) {
        hidden = !checked;
      } else {
        hidden = i >= colLen - 1;
      }
      if (checked) {
        formList.push({ showIndex: index, hidden: hidden, children: item });
        i++;
      }
    });
    setFormList(formList);
  };

  const handleSubmit = (formValues?: any, reset?: boolean) => {
    const values = formValues ?? form.getFieldsValue();
    const timeFileds = props.timeFileds ?? [];
    const timeFormat = props.timeFormat ?? 'YYYY-MM-DD';
    if (save) {
      searchValueMap.set(formKey, { ...values });
    }
    // 处理时间
    for (const filed of timeFileds) {
      const time = values?.[filed];
      if (time) {
        if (dayjs.isDayjs(time)) {
          values[filed] = formatTime(time, timeFormat);
        } else {
          values[filed] = arrTimeToString(time, timeFormat);
        }
      }
    }
    if (!reset) {
      onSearch?.(values);
    }
    onChange?.(values);
  };

  useEffect(() => {
    if (expand !== void 0) {
      expandMap.set(formKey, expand);
    }
    handleFormList();
    calcOffset();
  }, [showKeys, colLen, expand, props.children]);

  useEffect(() => {
    let initColSpan: any = {
      xxl: { span: 6 },
      xl: { span: 8 },
      sm: { span: 12 },
    };

    // span
    const getSpan = (col: number): number => {
      return 24 / col;
    };

    // onResize
    const onResize = () => {
      onDebounceResize(initColSpan);
    };

    let formValues: any = null;
    // 保存筛选项
    if (save) {
      formValues = searchValueMap.get(formKey);
    }
    // 初始值
    if (props.initialValues) {
      formValues = {
        ...props.initialValues,
        ...formValues,
      };
    }

    if (formValues) {
      form.setFieldsValue({ ...formValues });
      handleSubmit({ ...formValues });
    }

    // 设置col
    if (props.colLen) {
      if (typeof props.colLen === 'number') {
        initColSpan.xxl.span = getSpan(props.colLen);
        initColSpan.xl.span = getSpan(props.colLen);
        initColSpan.sm.span = getSpan(props.colLen);
      } else {
        if (props.colLen.xxl) {
          initColSpan.xxl.span = getSpan(props.colLen.xxl);
          initColSpan.xl.span = getSpan(props.colLen.xl);
          initColSpan.sm.span = getSpan(props.colLen.sm);
        }
      }
    }
    setColSpan({ ...initColSpan });
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      initColSpan = null;
    };
  }, []);

  return (
    <Card
      variant="borderless"
      className={styles.formSearch}
      style={props?.style}
      styles={{
        body: {
          paddingTop: 24,
          paddingBottom: 0,
          ...props.bodyStyle,
        },
      }}
    >
      <Form autoComplete="off" form={form} onFinish={handleSubmit}>
        <Row gutter={44}>
          {/* 表单 */}
          {formList?.map((item, index: number) => (
            <Col
              style={{ display: item.hidden ? 'none' : null }}
              key={item.showIndex}
              {...colSpan}
            >
              {item.children}
            </Col>
          ))}
          {/* 操作按钮 */}
          <Col {...colSpan} offset={offset}>
            <Form.Item style={{ textAlign: 'end' }}>
              <Space size={8}>
                <Button onClick={handleReset} htmlType="reset">
                  重置
                </Button>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Form.Item noStyle hidden={!showFilter}>
                  <Popover
                    content={
                      <TreeItem
                        options={children}
                        onChange={handleTreeChange}
                      />
                    }
                    placement="bottom"
                    trigger="click"
                  >
                    <Button type="primary">更多筛选</Button>
                  </Popover>
                </Form.Item>
                <Form.Item noStyle hidden={!showExpand}>
                  <Space
                    size={4}
                    className={styles.expand}
                    onClick={() => setExpand(!expand)}
                  >
                    <span>{expand ? '收起' : '展开'}</span>
                    {expand ? <UpOutlined /> : <DownOutlined />}
                  </Space>
                </Form.Item>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default FormSearch;
