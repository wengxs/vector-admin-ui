import { MenuTypeEnum } from "@/enums/MenuTypeEnum";

/**
 * 菜单查询参数类型
 */
export interface MenuQuery {
  menuName?: string;
}

/**
 * 菜单视图对象类型
 */
export interface MenuVO {
  /** 菜单ID */
  id?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 创建人 */
  createBy?: string;
  /** 菜单名称 */
  menuName?: string;
  /** 父级id */
  parentId?: number;
  /** 路径 */
  path?: string;
  /** 组件 */
  component?: string;
  /** 类型 */
  type?: string;
  /** 权限 */
  permission?: string;
  /** 图标 */
  icon?: string;
  /** 隐藏菜单 */
  hidden?: boolean;
  /** 排序 */
  sort?: number;
  /** 子菜单 */
  children?: MenuVO[];
}

/**
 * 菜单表单对象类型
 */
export interface MenuForm {
  /** 菜单ID */
  id?: number;
  /** 菜单名称 */
  menuName?: string;
  /** 父级id */
  parentId?: number;
  /** 路径 */
  path?: string;
  /** 组件 */
  component?: string;
  /** 类型 */
  type: MenuTypeEnum;
  /** 权限 */
  permission?: string;
  /** 图标 */
  icon?: string;
  /** 隐藏菜单 */
  hidden?: boolean;
  /** 排序 */
  sort?: number;
  /** 子权限 */
  subPermissions?: string[];
}

/**
 * 菜单树视图对象类型
 */
export interface MenuTreeVO {
  /** 菜单ID */
  id: number;
  /** 菜单名称 */
  menuName: string;
  /** 子菜单 */
  children?: MenuTreeVO[];
}
