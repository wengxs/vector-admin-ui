import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { DictQuery, DictVO, DictForm, DictOptionVO, DictOptionForm } from "./types";

/** 获取分页列表 */
export const listDict = (queryParams: DictQuery): AxiosPromise<PageResult<DictVO[]>> =>
  request.get('/sys/dict/list', { params: queryParams });

/** 获取详情 */
export const getDict = (id: number): AxiosPromise<DictVO> => request.get(`/sys/dict/${id}`);

/** 添加 */
export const addDict = (data: DictForm) => request.post('/sys/dict', data);

/** 修改 */
export const updateDict = (data: DictForm) => request.put('/sys/dict', data);

/** 删除 */
export const delDict = (ids: number[]) => request.delete(`/sys/dict/${ids}`);

/** 获取列表 */
export const listDictOption = (dictKey: string, onlyEnabled?: boolean): AxiosPromise<DictOptionVO[]> =>
  request.get('/sys/dict/option/list', { params: { dictKey, onlyEnabled } });

/** 获取详情 */
export const getDictOption = (id: number): AxiosPromise<DictOptionVO> => request.get(`/sys/dict/option/${id}`);

/** 添加 */
export const addDictOption = (data: DictOptionForm) => request.post('/sys/dict/option', data);

/** 修改 */
export const updateDictOption = (data: DictOptionForm) => request.put('/sys/dict/option', data);

/** 删除 */
export const delDictOption = (id: number) => request.delete(`/sys/dict/option/${id}`);
