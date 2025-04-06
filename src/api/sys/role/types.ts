/**
 * 角色查询参数
 */
export interface RoleQuery extends PageQuery {
  roleName?: string;
  roleKey?: string;
}

/**
 * 角色分页对象
 */
export interface RoleVO {
  /** 角色ID */
  id: number;
  /** 角色名称 */
  roleName: string;
  /** 角色编码 */
  roleKey?: string;
  /** 数据权限 */
  dataScope?: string;
  /** 角色描述 */
  description?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 角色权限ID集 */
  menuIds?: number[];
}

/**
 * 角色表单对象
 */
export interface RoleForm {
  /** 角色ID */
  id?: number;
  /** 角色名称 */
  roleName?: string;
  /** 角色编码 */
  roleKey?: string;
  /** 数据权限 */
  dataScope?: string;
  /** 角色描述 */
  description?: string;
  /** 角色权限ID集 */
  menuIds?: number[];
}
