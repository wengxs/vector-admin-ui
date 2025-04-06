/**
 * 查询参数
 */
export interface SmsLogQuery extends PageQuery {
  /** 短信平台 */
  platform?: string;
  /** 手机号码 */
  mobile?: string;
  /** 模版代码 */
  templateCode?: string;
  /** 发送结果 */
  result?: string;
}

/**
 * 对象视图
 */
export interface SmsLogVO {
  /** ID */
  id?: number;
  /** 创建时间 */
  createTime?: string;
  /** 短信平台 */
  platform?: string;
  /** 手机号码 */
  mobile?: string;
  /** 模版代码 */
  templateCode?: string;
  /** 模版参数 */
  templateParam?: string;
  /** 发送结果 */
  result?: string;
  /** 异常信息 */
  exception?: string;
}
