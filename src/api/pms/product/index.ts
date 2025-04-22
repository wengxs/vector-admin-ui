import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { ProductQuery, ProductVO, ProductForm } from "./types";

/** 获取分页列表 */
export const listProduct = (queryParams: ProductQuery): AxiosPromise<PageResult<ProductVO[]>> =>
  request.get("/product-api/pms/product/list", { params: queryParams });

/** 获取详情 */
export const getProduct = (id: number): AxiosPromise<ProductVO> =>
  request.get(`/product-api/pms/product/${id}`);

/** 模糊搜索 */
export const searchProduct = (keyword: string): AxiosPromise<ProductVO[]> =>
  request.get("/product-api/pms/product/search", { params: { q: keyword } });

/** 添加 */
export const addProduct = (data: ProductForm) => request.post("/product-api/pms/product", data);

/** 修改 */
export const updateProduct = (data: ProductForm) => request.put("/product-api/pms/product", data);

/** 删除 */
export const delProduct = (ids: number[]) => request.delete(`/product-api/pms/product/${ids}`);
