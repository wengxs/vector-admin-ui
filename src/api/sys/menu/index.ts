import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { MenuQuery, MenuVO, MenuForm, MenuTreeVO } from "./types";

/** 获取菜单树形列表 */
export const listMenu = (queryParams: MenuQuery): AxiosPromise<MenuVO[]> =>
  request.get("/sys/menu/list", { params: queryParams });

/** 获取菜单 */
export const getMenu = (id: number): AxiosPromise<MenuVO> => request.get(`/sys/menu/${id}`);

/** 添加菜单 */
export const addMenu = (data: MenuForm) => request.post("/sys/menu", data);

/** 修改菜单 */
export const updateMenu = (data: MenuForm) => request.put("/sys/menu", data);

/** 删除菜单 */
export const delMenu = (id: number) => request.delete(`/sys/menu/${id}`);

/** 获取菜单树形列表 */
export const getMenuTree = (): AxiosPromise<MenuTreeVO[]> => request.get("/sys/menu/tree");
