import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { SpuQuery, SpuVO, SpuAddForm } from "./types";

/** 获取分页列表 */
export const listSpu = (queryParams: SpuQuery): AxiosPromise<PageResult<SpuVO[]>> =>
  request.get("/pms/spu/list", { params: queryParams });

/** 获取详情 */
export const getSpu = (id: number): AxiosPromise<SpuVO> => request.get(`/pms/spu/${id}`);

/** 添加 */
export const addSpu = (data: SpuAddForm) => request.post("/pms/spu", data);

/** 修改 */
export const updateSpu = (data: SpuAddForm) => request.put("/pms/spu", data);

/** 删除 */
export const delSpu = (ids: number[]) => request.delete(`/pms/spu/${ids}`);
