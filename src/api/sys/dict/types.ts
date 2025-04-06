/**
 * 查询参数
 */
export interface DictQuery extends PageQuery {
  /** 字典名称 */
  dictName?: string;
  /** 字典状态 */
  dictStatus?: string;
}

/**
 * 对象视图
 */
export interface DictVO {
  /** ID */
  id?: number;
  /** 创建时间 */
  createTime?: string;
  /** 字典名称 */
  dictName?: string;
  /** 字典键 */
  dictKey?: string;
  /** 字典状态 */
  dictStatus?: string;
  /** 备注 */
  remark?: string;
  /** 选项 */
  options?: DictOptionVO[];
}

/**
 * 表单对象
 */
export interface DictForm {
  /** ID */
  id?: number;
  /** 字典名称 */
  dictName?: string;
  /** 字典键 */
  dictKey?: string;
  /** 字典状态 */
  dictStatus?: string;
  /** 备注 */
  remark?: string;
}

/**
 * 对象视图
 */
export interface DictOptionVO {
  /** ID */
  id?: number;
  /** 创建时间 */
  createTime?: string;
  /** 字典键 */
  dictKey?: string;
  /** 标签 */
  optionLabel?: string;
  /** 项值 */
  optionValue?: string;
  /** 排序 */
  sort?: number;
  /** 选项状态 */
  optionStatus?: string;
  /** 样式 */
  style?: string;
}

/**
 * 表单对象
 */
export interface DictOptionForm {
  /** ID */
  id?: number;
  /** 字典键 */
  dictKey?: string;
  /** 标签 */
  optionLabel?: string;
  /** 项值 */
  optionValue?: string;
  /** 排序 */
  sort?: number;
  /** 选项状态 */
  optionStatus?: string;
  /** 样式 */
  style?: string;
}
