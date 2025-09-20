import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Card, Row, Col, Space, FormInstance } from 'antd';
import { useThrottleFn } from 'ahooks';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { arrTimeToString, formatTime } from '@/utils/util';
import styles from './style.less';

type ColNumType = number | { xxl: number; xl: number; sm: number };

interface FormSearchProps {
  save?: boolean; // 保存筛选参数
  colNum?: ColNumType;
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

const XXL = 1600;
const XL = 1200;
const searchValueMap = new Map<string, any>(); // 搜索值map
const expandMap = new Map<string, boolean>(); // 筛选项展开map

// col span
const getColSpan = (colNum?: ColNumType) => {
  // 默认展示配置 xxl: 4个 xl: 3个 sm: 2个
  const colSpan = { xxl: { span: 6 }, xl: { span: 8 }, sm: { span: 12 } };
  // get span
  const getSpanByCol = (col: number) => 24 / col;
  // 自定义
  if (colNum) {
    if (typeof colNum === 'number') {
      const span = getSpanByCol(colNum);
      colSpan.xxl.span = span;
      colSpan.xl.span = span;
      colSpan.sm.span = span;
    } else {
      if (colNum.xxl) {
        colSpan.xxl.span = getSpanByCol(colNum.xxl);
      }
      if (colNum.xl) {
        colSpan.sm.span = getSpanByCol(colNum.xl);
      }
      if (colNum.sm) {
        colSpan.xl.span = getSpanByCol(colNum.xl);
      }
    }
  }
  return colSpan;
};

const getColAndOffset = (colNum: ColNumType | undefined, total: number) => {
  const VW = window.innerWidth;
  const colSpan = getColSpan(colNum);
  // get span
  const getColBySpan = (span: number) => 24 / span;

  let col = 0; // 单行展示个数
  let span = 0; // col对应span
  let expandOffset = 0; // 展开offset
  let collapsedOffset = 0; // 折叠offset
  // span
  if (VW >= XXL) {
    span = colSpan.xxl.span;
  } else if (VW >= XL) {
    span = colSpan.xl.span;
  } else {
    span = colSpan.sm.span;
  }
  col = getColBySpan(span);
  expandOffset = (col - (total % col) - 1) * span; // (total % col) 多出数量
  collapsedOffset = total >= col ? 0 : (col - total - 1) * span;
  return {
    col,
    expandOffset,
    collapsedOffset,
    colSpan,
  };
};

const getRenders = (children: any) => {
  const childrens: any[] = children?.length > 1 ? children : [children];
  const displayChildren = childrens.filter((render) => !render?.props?.hidden);
  const hiddenChildren = childrens.filter((render) => render?.props?.hidden);
  return {
    displayChildren,
    hiddenChildren,
  };
};

const ExpandButton = (props: { expand?: boolean }) => {
  if (props.expand) {
    return (
      <>
        <span>收起</span>
        <UpOutlined />
      </>
    );
  }

  return (
    <>
      <span>展开</span>
      <DownOutlined />
    </>
  );
};

const FormSearch: React.FC<FormSearchProps> = (props) => {
  const {
    onReset,
    onSearch,
    onChange,
    save = false,
    formKey = location.pathname,
  } = props;
  const [renders] = useState(getRenders(props.children));
  const total = renders.displayChildren.length;
  const [colOffset, setColOffset] = useState(
    getColAndOffset(props.colNum, total),
  );
  const [expand, setExpand] = useState<boolean>(!!expandMap.get(formKey));
  const colNum = useMemo(() => colOffset.col, [colOffset]);
  const colSpan = useMemo(() => colOffset.colSpan, [colOffset]);

  const form = props.form ?? Form.useForm()[0]; // form
  const showExpand = total >= colOffset.col; // 显示展开按钮

  const reCalcColOffset = () => {
    setColOffset(getColAndOffset(props.colNum, total));
  };

  // 窗口变化
  const { run: onResize } = useThrottleFn(reCalcColOffset, {
    wait: 100,
  });

  // 重置
  const handleReset = () => {
    const initialValues = Object.assign({}, props.initialValues);
    onReset?.();
    form.resetFields();
    setTimeout(() => {
      form.setFieldsValue(initialValues);
    }, 0);
    handleSubmit(initialValues, true);
    if (save) {
      searchValueMap.delete(formKey);
    }
  };

  useEffect(() => {
    reCalcColOffset();
  }, [renders]);

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

  const triggerExpand = () => {
    const newVal = !expand;
    setExpand(newVal);
    expandMap.set(formKey, newVal);
  };

  useEffect(() => {
    let formValues: any = null;
    // 开启保存筛选表单
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
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
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
          {renders.displayChildren.map((render, index) =>
            !expand && index >= colNum - 1 ? (
              <Form.Item key={index} hidden noStyle>
                {render}
              </Form.Item>
            ) : (
              <Col key={index} {...colSpan}>
                {render}
              </Col>
            ),
          )}
          {/* hidden 表单 */}
          {renders.hiddenChildren.map((render, index) => (
            <Form.Item key={index} hidden noStyle>
              {render}
            </Form.Item>
          ))}

          {/* 操作按钮 */}
          <Col
            {...colSpan}
            offset={expand ? colOffset.expandOffset : colOffset.collapsedOffset}
          >
            <Form.Item style={{ textAlign: 'end' }}>
              <Space size={8}>
                <Button onClick={handleReset} htmlType="reset">
                  重置
                </Button>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Form.Item noStyle hidden={!showExpand}>
                  <Space
                    size={4}
                    className={styles.expand}
                    onClick={() => triggerExpand()}
                  >
                    <ExpandButton expand={expand} />
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
