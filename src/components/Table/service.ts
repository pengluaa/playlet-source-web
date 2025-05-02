import { requestAdapter as request } from "@/utils/request";

// 获取表头
export const getColumns = (key: string | number) => {
  return request("/api/custom_config/list", { params: { key } });
};

// 添加表头
export const addColumns = (data: any) => {
  return request("/api/custom_config/add", { method: "post", data });
};

// 删除表头
export const deleteColumns = (key: string | number, index: number) => {
  return request("/api/custom_config/delete", {
    method: "post",
    data: { key, index },
  });
};

// 修改默认
export const setDefault = (key: string | number, index: number) => {
  return request("/api/custom_config/default", {
    method: "post",
    data: { key, index },
  });
};
