import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { TableQuery, TableVO, TableForm } from "./types";

/** 获取分页数据 */
export const listTable = (queryParams?: TableQuery): AxiosPromise<PageResult<TableVO[]>> =>
  request.get("/dev-api/code/gen/list", { params: queryParams });

/** 获取详情 */
export const getTable = (id: number): AxiosPromise<TableVO> => request.get(`/dev-api/code/gen/${id}`);

/** 添加 */
export const addTable = (data: TableForm) => request.post("/dev-api/code/gen", data);

/** 修改 */
export const updateTable = (data: TableForm) => request.put("/dev-api/code/gen", data);

/** 删除角色 */
export const delTable = (ids: number[]) => request.delete(`/dev-api/code/gen/${ids}`);

/** 预览代码 */
export const previewCode = (id: number): AxiosPromise => request.get(`/dev-api/code/gen/preview/${id}`);

export const listDatabase = () => request.get("/dev-api/code/gen/dbList");

export const listDbTable = (queryParams: TableQuery) =>
  request.get("/dev-api/code/gen/schemaList", { params: queryParams });

export const importTable = (dbName: string, tableName: string) =>
  request.post(`/dev-api/code/gen/schemaImport/${dbName}/${tableName}`);
