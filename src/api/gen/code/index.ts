import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { TableQuery, TableVO, TableForm } from "./types";

/** 获取分页数据 */
export const listTable = (queryParams?: TableQuery): AxiosPromise<PageResult<TableVO[]>> =>
  request.get("/dev-api/gen/code/list", { params: queryParams });

/** 获取详情 */
export const getTable = (id: number): AxiosPromise<TableVO> => request.get(`/dev-api/gen/code/${id}`);

/** 添加 */
export const addTable = (data: TableForm) => request.post("/dev-api/gen/code", data);

/** 修改 */
export const updateTable = (data: TableForm) => request.put("/dev-api/gen/code", data);

/** 删除角色 */
export const delTable = (ids: number[]) => request.delete(`/dev-api/gen/code/${ids}`);

/** 预览代码 */
export const previewCode = (id: number): AxiosPromise => request.get(`/dev-api/gen/code/preview/${id}`);

export const listDatabase = () => request.get("/dev-api/gen/code/dbList");

export const listDbTable = (queryParams: TableQuery) =>
  request.get("/dev-api/gen/code/schemaList", { params: queryParams });

export const importTable = (dbName: string, tableName: string) =>
  request.post(`/dev-api/gen/code/schemaImport/${dbName}/${tableName}`);
