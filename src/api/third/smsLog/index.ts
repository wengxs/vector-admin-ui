import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { SmsLogQuery, SmsLogVO } from "./types";

/** 获取分页列表 */
export const listSmsLog = (queryParams: SmsLogQuery): AxiosPromise<PageResult<SmsLogVO[]>> =>
  request.get('/third-api/sms/log/list', { params: queryParams });

/** 获取详情 */
export const getSmsLog = (id: number): AxiosPromise<SmsLogVO> => request.get(`/third-api/sms/log/${id}`);

/** 删除 */
export const delSmsLog = (ids: number[]) => request.delete(`/third-api/sms/log/${ids}`);
