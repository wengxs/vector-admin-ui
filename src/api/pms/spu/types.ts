/**
 * 查询参数
 */
export interface SpuQuery extends PageQuery {
  /** 商品标题 */
  spuName?: string;
  /** 商品状态 */
  spuStatus?: string;
  /** 分类ID */
  categoryId?: number;
}

/**
 * 对象视图
 */
export interface SpuVO {
  /** ID */
  id?: number;
  /** 创建时间 */
  createTime?: string;
  /** 创建人 */
  createBy?: string;
  /** 商品标题 */
  spuName?: string;
  /** 商品状态 */
  spuStatus?: string;
  /** 默认图片 */
  defaultImage?: string;
  /** 分类ID */
  categoryId?: number;
  /** 分类ID */
  categoryName?: string;
  /** 总销量 */
  saleCount?: number;
  /** 审核时间 */
  approveTime?: string;
  /** 上架时间 */
  onTime?: string;
  /** 下架时间 */
  offTime?: string;
  /** 驳回原因 */
  rejectReason?: string;
  /** 图片列表 */
  images?: string[];
}

/**
 * 表单对象
 */
export interface SpuAddForm {
  /** ID */
  id?: number;
  /** 分类ID */
  categoryId?: number;
  /** 商品标题 */
  spuName?: string;
  /** 默认图片 */
  images?: string[];
  /** 商品描述 */
  description?: string;
  /** SKU */
  skus?: any[];
  /** 规格属性 */
  specs?: any[];
}
