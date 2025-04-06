/**
 * 查询参数
 */
export interface SupplierQuery extends PageQuery {
  /** 供应商 */
  supplierName?: string;
  /** 联系人 */
  contacts?: string;
  /** 联系电话 */
  mobile?: string;
  /** 所在省份 */
  province?: string;
  /** 详细地址 */
  address?: string;
}

/**
 * 对象视图
 */
export interface SupplierVO {
  /** ID */
  id?: number;
  /** 创建时间 */
  createTime?: string;
  /** 供应商 */
  supplierName?: string;
  /** 联系人 */
  contacts?: string;
  /** 联系电话 */
  mobile?: string;
  /** 所在省份 */
  province?: string;
  /** 详细地址 */
  address?: string;
}

/**
 * 表单对象
 */
export interface SupplierForm {
  /** ID */
  id?: number;
  /** 供应商 */
  supplierName?: string;
  /** 联系人 */
  contacts?: string;
  /** 联系电话 */
  mobile?: string;
  /** 所在省份 */
  province?: string;
  /** 详细地址 */
  address?: string;
}
