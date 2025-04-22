import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { DictQuery, DictVO, DictForm, DictOptionVO, DictOptionForm } from "./types";

/** 获取分页列表 */
export const listDict = (queryParams: DictQuery): AxiosPromise<PageResult<DictVO[]>> =>
  request.get('/system-api/sys/dict/list', { params: queryParams });

/** 获取详情 */
export const getDict = (id: number): AxiosPromise<DictVO> => request.get(`/system-api/sys/dict/${id}`);

/** 添加 */
export const addDict = (data: DictForm) => request.post('/system-api/sys/dict', data);

/** 修改 */
export const updateDict = (data: DictForm) => request.put('/system-api/sys/dict', data);

/** 删除 */
export const delDict = (ids: number[]) => request.delete(`/system-api/sys/dict/${ids}`);

/** 获取列表 */
export const listDictOption = (dictKey: string, onlyEnabled?: boolean): AxiosPromise<DictOptionVO[]> =>
  request.get('/system-api/sys/dict/option/list', { params: { dictKey, onlyEnabled } });

/** 获取详情 */
export const getDictOption = (id: number): AxiosPromise<DictOptionVO> => request.get(`/system-api/sys/dict/option/${id}`);

/** 添加 */
export const addDictOption = (data: DictOptionForm) => request.post('/system-api/sys/dict/option', data);

/** 修改 */
export const updateDictOption = (data: DictOptionForm) => request.put('/system-api/sys/dict/option', data);

/** 删除 */
export const delDictOption = (id: number) => request.delete(`/system-api/sys/dict/option/${id}`);
