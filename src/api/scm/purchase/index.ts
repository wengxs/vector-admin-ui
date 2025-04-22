import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PurchaseQuery, PurchaseVO, PurchaseForm } from "./types";

/** 获取分页列表 */
export const listPurchase = (queryParams: PurchaseQuery): AxiosPromise<PageResult<PurchaseVO[]>> =>
  request.get("/supply-api/scm/purchase/list", { params: queryParams });

/** 获取详情 */
export const getPurchase = (id: number): AxiosPromise<PurchaseVO> =>
  request.get(`/supply-api/scm/purchase/${id}`);

/** 添加 */
export const addPurchase = (data: PurchaseForm) => request.post("/supply-api/scm/purchase", data);

/** 修改 */
export const updatePurchase = (data: PurchaseForm) => request.put("/supply-api/scm/purchase", data);

/** 取消 */
export const cancelPurchase = (id: number) => request.put(`/supply-api/scm/purchase/${id}/cancel`);

/** 提交 */
export const submitPurchase = (id: number) => request.put(`/supply-api/scm/purchase/${id}/submit`);

/** 签约 */
export const signPurchase = (id: number) => request.put(`/supply-api/scm/purchase/${id}/sign`);

/** 发货 */
export const sendPurchase = (id: number, data: any) =>
  request.put(`/supply-api/scm/purchase/${id}/send`, data);
