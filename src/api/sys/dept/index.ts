import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { DeptQuery, DeptVO, DeptForm, DeptTree } from "./types";

/** 获取分页列表 */
export const listDept = (queryParams: DeptQuery): AxiosPromise<DeptVO[]> =>
  request.get('/sys/dept/list', { params: queryParams });

/** 获取详情 */
export const getDept = (id: number): AxiosPromise<DeptVO> => request.get(`/sys/dept/${id}`);

/** 添加 */
export const addDept = (data: DeptForm) => request.post('/sys/dept', data);

/** 修改 */
export const updateDept = (data: DeptForm) => request.put('/sys/dept', data);

/** 删除 */
export const delDept = (ids: number[]) => request.delete(`/sys/dept/${ids}`);

/** 获取部门树形列表 */
export const getDeptTree = (): AxiosPromise<DeptTree[]> => request.get("/sys/dept/tree");
