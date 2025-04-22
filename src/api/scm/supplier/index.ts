import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { SupplierQuery, SupplierVO, SupplierForm } from "./types";

/** 获取分页列表 */
export const listSupplier = (queryParams: SupplierQuery): AxiosPromise<PageResult<SupplierVO[]>> =>
  request.get("/supply-api/scm/supplier/list", { params: queryParams });

/** 获取详情 */
export const getSupplier = (id: number): AxiosPromise<SupplierVO> =>
  request.get(`/supply-api/scm/supplier/${id}`);

/** 模糊搜索 */
export const searchSupplier = (keyword: string): AxiosPromise<SupplierVO[]> =>
  request.get("/supply-api/scm/supplier/search", { params: { q: keyword } });

/** 添加 */
export const addSupplier = (data: SupplierForm) => request.post("/supply-api/scm/supplier", data);

/** 修改 */
export const updateSupplier = (data: SupplierForm) => request.put("/supply-api/scm/supplier", data);

/** 删除 */
export const delSupplier = (ids: number[]) => request.delete(`/supply-api/scm/supplier/${ids}`);
