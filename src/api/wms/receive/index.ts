import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { ReceiveQuery, ReceiveVO, ReceiveForm } from "./types";

/** 获取分页列表 */
export const listReceive = (queryParams: ReceiveQuery): AxiosPromise<PageResult<ReceiveVO[]>> =>
  request.get("/wms/receive/list", { params: queryParams });

/** 获取详情 */
export const getReceive = (id: number): AxiosPromise<ReceiveVO> =>
  request.get(`/wms/receive/${id}`);

/** 添加 */
export const addReceive = (data: ReceiveForm) => request.post("/wms/receive", data);

/** 修改 */
export const updateReceive = (data: ReceiveForm) => request.put("/wms/receive", data);

/** 删除 */
export const delReceive = (ids: number[]) => request.delete(`/wms/receive/${ids}`);
