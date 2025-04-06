/**
 * 查询参数
 */
export interface CategoryQuery {
  /** 分类名称 */
  categoryName?: string;
}

/**
 * 对象视图
 */
export interface CategoryVO {
  /** ID */
  id?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 创建人 */
  createBy?: string;
  /** 分类名称 */
  categoryName?: string;
  /** 图标 */
  icon?: string;
  /** 父级ID */
  parentId?: string;
  /** 层级 */
  level?: string;
  /** 排序 */
  sort?: string;
  /** 展示状态 */
  displayed?: string;
}

/**
 * 表单对象
 */
export interface CategoryForm {
  /** ID */
  id?: number;
  /** 分类名称 */
  categoryName?: string;
  /** 图标 */
  icon?: string;
  /** 父级ID */
  parentId?: number;
  /** 层级 */
  level?: number;
  /** 排序 */
  sort?: number;
  /** 展示状态 */
  displayed?: boolean;
}

/**
 * 树结构分类视图
 */
export interface CategoryTreeVO {
  /** ID */
  id?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 创建人 */
  createBy?: string;
  /** 分类名称 */
  categoryName?: string;
  /** 图标 */
  icon?: string;
  /** 父级ID */
  parentId?: string;
  /** 层级 */
  level?: string;
  /** 排序 */
  sort?: string;
  /** 展示状态 */
  displayed?: string;
  /** 子分类 */
  children?: CategoryTreeVO[];
}
