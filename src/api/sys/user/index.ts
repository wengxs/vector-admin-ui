import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { UserForm, UserVO, UserQuery } from "./types";

/** 获取用户分页列表 */
export const listUser = (queryParams: UserQuery): AxiosPromise<PageResult<UserVO[]>> =>
  request.get("/system-api/sys/user/list", { params: queryParams });

/** 获取用户表单详情 */
export const getUser = (id: number): AxiosPromise<UserVO> => request.get(`/system-api/sys/user/${id}`);

/** 添加用户 */
export const addUser = (data: UserForm) => request.post("/system-api/sys/user", data);

/** 修改用户 */
export const updateUser = (data: UserForm) => request.put("/system-api/sys/user", data);
