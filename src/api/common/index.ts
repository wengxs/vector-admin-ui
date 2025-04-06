import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { FileInfo } from "./types";

/**
 * 上传文件
 * @param file
 */
export const uploadFile = (file: File): AxiosPromise<FileInfo> => {
  const formData = new FormData();
  formData.append("file", file);
  return request.post("/third/file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * 删除文件
 * @param filePath 文件完整路径
 */
export const deleteFile = (filePath?: string) =>
  request.delete("/third/file", { params: { filePath: filePath } });

/**
 * 根据枚举名称获取枚举列表
 * @param enumName
 */
export const getEnumByName = (enumName: string): AxiosPromise<OptionType[]> =>
  request.get(`/common/enum/${enumName}`);
