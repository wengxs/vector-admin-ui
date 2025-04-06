/**
 * 查询参数
 */
export interface ProductQuery extends PageQuery {
  /** 产品名称 */
  productName?: string;
  /** 生产厂家 */
  factory?: string;
}

/**
 * 对象视图
 */
export interface ProductVO {
  /** ID */
  id?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 创建人 */
  createBy?: string;
  /** 产品名称 */
  productName?: string;
  /** 生产厂家 */
  factory?: string;
}

/**
 * 表单对象
 */
export interface ProductForm {
  /** ID */
  id?: number;
  /** 产品名称 */
  productName?: string;
}
