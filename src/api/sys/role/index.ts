import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { RoleQuery, RoleVO, RoleForm } from "./types";

/** 获取角色分页数据 */
export const listRole = (queryParams?: RoleQuery): AxiosPromise<PageResult<RoleVO[]>> =>
  request.get("/system-api/sys/role/list", { params: queryParams });

/** 获取角色详情 */
export const getRole = (id: number): AxiosPromise<RoleVO> => request.get(`/system-api/sys/role/${id}`);

/** 添加角色 */
export const addRole = (data: RoleForm) => request.post("/system-api/sys/role", data);

/** 修改角色 */
export const updateRole = (data: RoleForm) => request.put("/system-api/sys/role", data);

/** 删除角色 */
export const delRole = (ids: number[]) => request.delete(`/system-api/sys/role/${ids}`);

/** 获取角色下拉数据 */
export const getAllRole = (): AxiosPromise<RoleVO[]> => request.get("/system-api/sys/role/all");
