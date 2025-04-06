import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { CaptchaResult, LoginData, LoginResult } from "./types";

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<string | any> {
  const formData = new FormData();
  formData.append("grant_type", "password");
  formData.append("username", data.username);
  formData.append("password", data.password);
  // formData.append("captchaKey", data.captchaKey || "");
  // formData.append("captchaCode", data.captchaCode || "");
  return request({
    url: import.meta.env.VITE_APP_LOGIN_URI,
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": "Basic dmVjdG9yLWFkbWluOmFkbWlu" // base64(vector-admin:admin)
    },
  });
}

/**
 * 注销API
 */
export const logoutApi = () => request.delete(import.meta.env.VITE_APP_LOGOUT_URI);

/**
 * 获取验证码
 */
export const getCaptchaApi = (): AxiosPromise<CaptchaResult> => request.get("/auth/captcha");
