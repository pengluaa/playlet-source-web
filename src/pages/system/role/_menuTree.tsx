import React, { useEffect, useState } from 'react';
import { Tree, Spin } from 'antd';

import { getMenuTree as getMenuTreeSv } from '../menu/service';
interface MenuTreeProps {
  defaultExpandAll?: boolean;
  value?: number[];
  onChange?: (values: number[]) => void;
}

const MenuTree = (props: MenuTreeProps) => {
  const { value, defaultExpandAll = true } = props;
  const [treeData, setTreeData] = useState<any[]>([]);

  const getTree = () => {
    getMenuTreeSv()
      .then((res) => {
        setTreeData(res);
      })
      .catch(() => {});
  };

  const onCheck = (values: any, other: any) => {
    props.onChange?.(values.checked);
  };

  useEffect(() => {
    getTree();
  }, []);

  if (!treeData.length) {
    return <Spin spinning={true}></Spin>;
  }

  return (
    <Tree
      checkable
      selectable={false}
      defaultExpandAll={defaultExpandAll}
      autoExpandParent
      checkedKeys={{
        checked: value ?? [],
        halfChecked: [],
      }}
      treeData={treeData}
      checkStrictly={true}
      fieldNames={{ key: 'id', title: 'name' }}
      onCheck={onCheck}
    />
  );
};

export default MenuTree;
