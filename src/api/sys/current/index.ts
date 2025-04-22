import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { LoginUser, PasswordForm, ProfileForm } from "./types";

/**
 * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
 */
export const getLoginUser = (): AxiosPromise<LoginUser> => request.get("/system-api/sys/current/profile");

/** 当前用户菜单 */
export const getUserMenu = (): AxiosPromise => request.get("/system-api/sys/current/menu");

export const updateProfile = (data: ProfileForm) => request.put("/system-api/sys/current/profile", data);

export const updatePassword = (data: PasswordForm) => request.put("/system-api/sys/current/password", data);
