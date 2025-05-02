import { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useDebounceFn } from 'ahooks';

import type { SelectProps } from 'antd';
import {
  getScrollHeight,
  getScrollTop,
  getVisibleHeight,
} from '@/utils/scroll';
import { deduplication } from '@/utils/util';

type ValueType = 'string' | 'number';
interface Props extends SelectProps {
  valueType?: ValueType;
  fetchFn?: (values?: any) => Promise<ResponseOk<any> | ResponseErr>;
}

const paegSize = 50;
let scrollLock = false;

const PagerSelect = (props: Props) => {
  const [selectOptions, setSelectOptions] = useState<any[]>([]);
  const [options, setOptons] = useState<any[]>([]);
  const [displayOptions, setDisplayOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>();

  const { run: getList } = useDebounceFn(
    async () => {
      setLoading(true);
      const index = pageIndex;
      const res = await props.fetchFn?.({
        pageNo: index,
        pageSize: paegSize,
        keyword: keyword,
      });
      scrollLock = false;
      setLoading(false);
      if (!res || res?.error) return;

      const list = res.data?.list;
      if (index === 1) {
        options.length = 0;
      }
      options.push(...list);
      const totalPage = Math.ceil(res.data.total / paegSize);
      setHasMore(totalPage > index);
      setOptons([...options]);
    },
    { wait: 200 },
  );

  const getListByIds = async () => {
    if (!props.value) {
      setSelectOptions([]);
      return;
    }
    const values = (props.value as string | string[]).toString().split(',');
    const optionsIds = options.map((item) => item.id);
    const ids: string[] = [];
    values.forEach((id) => {
      if (!optionsIds.includes(+id)) {
        ids.push(id);
      }
    });
    if (!ids.length) {
      return;
    }
    const res = await props.fetchFn?.({
      ids: ids.toString(),
    });
    if (!res || res.error) return;
    setSelectOptions(res.data?.list);
  };

  const onSearch = (value: string) => {
    setPageIndex(1);
    setHasMore(true);
    setKeyword(value);
  };

  const onSelect = (value: any, item: any) => {
    selectOptions.push(item);
    setSelectOptions([...selectOptions]);
  };
  const onDeselect = (value: any, item: any) => {
    const index = selectOptions.findIndex((item) => item.id === value);
    selectOptions.splice(index, 1);
    setSelectOptions([...selectOptions]);
  };

  const onPopupScroll = (e: any): void => {
    if (scrollLock || !hasMore) return;

    const { target } = e;
    const reachBottomH = 100;
    const st = getScrollTop(target);
    const sh = getScrollHeight(target);
    const vh = getVisibleHeight(target);
    if (sh - st - vh < reachBottomH) {
      scrollLock = true;
      setPageIndex(pageIndex + 1);
    }
  };

  const getValue = (value: string | number | (string | number)[]) => {
    const valueType = props.valueType;
    if (!value || !valueType) {
      return value;
    }

    const getValByType = (val: string | number, valType: ValueType) => {
      if (valType === 'string') {
        return val.toString();
      }
      if (valType === 'number') {
        return isNaN(+val) ? val : +val;
      }
      return val;
    };

    if (value instanceof Array) {
      return value.map((val) => getValByType(val, valueType));
    }
    return getValByType(value, valueType);
  };

  useEffect(() => {
    getList();
  }, [pageIndex, keyword]);

  useEffect(() => {
    setDisplayOptions(deduplication([...selectOptions, ...options], 'id'));
  }, [selectOptions, options]);

  useEffect(() => {
    getListByIds();
  }, [props.value]);

  return (
    <Select
      showSearch
      disabled={props.disabled}
      value={getValue(props.value)}
      filterOption={false}
      maxCount={props.maxCount}
      maxTagCount={props.maxTagCount}
      mode={props.mode}
      fieldNames={props.fieldNames}
      loading={loading}
      options={displayOptions}
      placeholder="请选择"
      onChange={props.onChange}
      onSelect={onSelect}
      onDeselect={onDeselect}
      onSearch={onSearch}
      onPopupScroll={onPopupScroll}
    />
  );
};

export default PagerSelect;
