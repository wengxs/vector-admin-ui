/**
 * 登录用户信息
 */
export interface UserInfo {
  userId?: number;
  username?: string;
  nickname?: string;
  avatar?: string;
  deptName?: string;
  roles: string[];
  permissions: string[];
}

/**
 * 用户查询对象类型
 */
export interface UserQuery extends PageQuery {
  username?: string;
  mobile?: string;
  userStatus?: string;
  deptId?: number;
}

/**
 * 用户分页对象
 */
export interface UserVO {
  /** 用户ID */
  id?: number;
  /** 用户名 */
  username?: string;
  /** 昵称 */
  nickname?: string;
  /** 手机号码 */
  mobile?: string;
  /** 邮箱 */
  email?: string;
  /** 性别 */
  gender?: string;
  /** 用户头像 */
  avatar?: string;
  /** 用户状态(ENABLED:正常;DISABLE:禁用) */
  userStatus?: string;
  /** 部门ID */
  deptId?: number;
  /** 部门 */
  deptName?: string;
  /** 备注 */
  remark?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 角色名称，多个使用英文逗号(,)分割 */
  roleNames?: string;
  /** 角色ID，多个使用英文逗号(,)分割 */
  roleIds?: number[];
}

/**
 * 用户表单类型
 */
export interface UserForm {
  /** 用户ID */
  id?: number;
  /** 用户名 */
  username?: string;
  /** 昵称 */
  nickname?: string;
  /** 用户密码 */
  password?: string;
  /** 手机号码 */
  mobile?: string;
  /** 邮箱 */
  email?: string;
  /** 性别 */
  gender?: string;
  /** 用户头像 */
  avatar?: string;
  /** 用户状态(ENABLED:正常;DISABLE:禁用) */
  userStatus?: string;
  /** 部门ID */
  deptId?: number;
  /** 备注 */
  remark?: string;
  /** 角色ID集合 */
  roleIds?: number[];
}
