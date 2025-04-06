/**
 * 查询参数
 */
export interface DeptQuery extends PageQuery {
  /** 部门名称 */
  deptName?: string;
  /** 部门状态 */
  deptStatus?: string;
}

/**
 * 对象视图
 */
export interface DeptVO {
  /** 部门ID */
  id?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 上级部门ID */
  parentId?: number;
  /** 祖级列表 */
  ancestors?: string;
  /** 部门名称 */
  deptName?: string;
  /** 部门领导 */
  leader?: string;
  /** 联系电话 */
  phone?: string;
  /** 邮箱 */
  email?: string;
  /** 部门状态 */
  deptStatus?: string;
  /** 备注 */
  remark?: string;
  /** 排序 */
  sort?: number;
  /** 子菜单 */
  children?: DeptVO[];
}

/**
 * 表单对象
 */
export interface DeptForm {
  // [key: string]: any;
  /** ID */
  id?: number;
  /** 上级部门ID */
  parentId?: number;
  /** 部门名称 */
  deptName?: string;
  /** 部门领导 */
  leader?: string;
  /** 联系电话 */
  phone?: string;
  /** 邮箱 */
  email?: string;
  /** 部门状态 */
  deptStatus?: string;
  /** 备注 */
  remark?: string;
  /** 排序 */
  sort?: number;
}


/**
 * 部门树对象类型
 */
export interface DeptTree {
  /** 部门ID */
  id: number;
  /** 部门名称 */
  deptName: string;
  /** 子部门 */
  children?: DeptTree[];
}
