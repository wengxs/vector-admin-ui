/**
 * 查询参数
 */
export interface ReceiveQuery extends PageQuery {
  /** 收货单号 */
  receiveNo?: string;
  /** 收货状态 */
  receiveStatus?: string;
  /** 业务类型 */
  bizType?: string;
  /** 业务单号 */
  bizNo?: string;
  /** 物流名称 */
  logisticsName?: string;
  /** 物流单号 */
  logisticsNo?: string;
  /** 批次编号 */
  batchNo?: string;
  /** 签收时间：起 */
  signedBegin?: string;
  /** 签收时间：止 */
  signedEnd?: string;
  /** 产品ID */
  productId?: number;
  /** 产品名称 */
  productName?: string;
}

/**
 * 对象视图
 */
export interface ReceiveVO {
  /** ID */
  id?: number;
  /** 创建时间 */
  createTime?: string;
  /** 收货单号 */
  receiveNo?: string;
  /** 收货状态 */
  receiveStatus?: string;
  /** 业务类型 */
  bizType?: string;
  /** 业务单号 */
  bizNo?: string;
  /** 物流名称 */
  logisticsName?: string;
  /** 物流单号 */
  logisticsNo?: string;
  /** 签收时间 */
  signedTime?: string;
  /** 批次编号 */
  batchNo?: string;
  /** 收货明细 */
  details: ReceiveDetail[];
}

/**
 * 表单对象
 */
export interface ReceiveForm {
  /** ID */
  id?: number;
  /** 业务类型 */
  bizType?: string;
  /** 业务单号 */
  bizNo?: string;
  /** 物流名称 */
  logisticsName?: string;
  /** 物流单号 */
  logisticsNo?: string;
  /** 收货明细 */
  details: ReceiveDetail[];
}

export interface ReceiveDetail {
  /** ID */
  id?: number;
  /** 收货单ID */
  receiveId?: number;
  /** 产品ID */
  productId?: number;
  /** 产品名称 */
  productName?: string;
  /** 应收数量 */
  qty?: number;
  /** 实收数量 */
  receivedQty?: number;
  /** 合格数量 */
  qualifiedQty?: number;
  /** 不合格数量 */
  unqualifiedQty?: number;
}
