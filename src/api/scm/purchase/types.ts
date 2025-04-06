/**
 * 查询参数
 */
export interface PurchaseQuery extends PageQuery {
  /** 订单编号 */
  purchaseNo?: string;
  /** 订单状态 */
  purchaseStatus?: string;
  /** 供应商 */
  supplierName?: string;
  /** 产品名称 */
  productName?: string;
}

/**
 * 对象视图
 */
export interface PurchaseVO {
  /** ID */
  id?: number;
  /** 创建时间 */
  createTime?: string;
  /** 订单编号 */
  purchaseNo?: string;
  /** 订单状态 */
  purchaseStatus?: string;
  /** 供应商ID */
  supplierId?: number;
  /** 供应商 */
  supplierName?: string;
  /** 采购备注 */
  purchaseRemake?: string;
  /** 订单金额 */
  amount?: string;
  /** 签约时间 */
  signedTime?: string;
  /** 完结时间 */
  finishedTime?: string;
  /** 取消时间 */
  canceledTime?: string;
  /** 采购明细 */
  details: PurchaseDetail[];
}

/**
 * 表单对象
 */
export interface PurchaseForm {
  /** ID */
  id?: number;
  /** 订单编号 */
  purchaseNo?: string;
  /** 供应商编号 */
  supplierId?: number;
  /** 供应商名称 */
  supplierName?: string;
  /** 采购备注 */
  purchaseRemake?: string;
  /** 采购明细 */
  details: PurchaseDetail[];
}

export interface PurchaseDetail {
  /** 产品编号 */
  productId?: number;
  /** 产品编号 */
  productName?: string;
  /** 单价 */
  price?: number;
  /** 数量 */
  qty?: number;
  /** 合计 */
  amount?: number;
}
