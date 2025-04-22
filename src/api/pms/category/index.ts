import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { CategoryQuery, CategoryVO, CategoryForm, CategoryTreeVO } from "./types";

/** 获取分页列表 */
export const listCategory = (queryParams: CategoryQuery): AxiosPromise<PageResult<CategoryVO[]>> =>
  request.get("/product-api/pms/category/list", { params: queryParams });

/** 获取详情 */
export const getCategory = (id: number): AxiosPromise<CategoryVO> =>
  request.get(`/product-api/pms/category/${id}`);

/** 添加 */
export const addCategory = (data: CategoryForm) => request.post("/product-api/pms/category", data);

/** 修改 */
export const updateCategory = (data: CategoryForm) => request.put("/product-api/pms/category", data);

/** 删除 */
export const delCategory = (ids: number[]) => request.delete(`/product-api/pms/category/${ids}`);

/** 获取分类树 */
export const getCategoryTree = (queryParams?: CategoryQuery): AxiosPromise<CategoryTreeVO[]> =>
  request.get(`/product-api/pms/category/tree`, { params: queryParams });
