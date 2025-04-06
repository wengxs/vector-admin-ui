/**
 * 查询参数
 */
export interface TableQuery extends PageQuery {
  /** 数据库名 */
  dbName?: string;
  /** 表名称 */
  tbName?: string;
  /** 表描述 */
  tbComment?: string;
}

/**
 * 代码视图
 */
export interface TableVO {
  /** ID */
  id?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 数据库名 */
  dbName?: string;
  /** 表名称 */
  tbName?: string;
  /** 表描述 */
  tbComment?: string;
  /** 实体类名称(首字母大写) */
  className?: string;
  /** 生成包路径 */
  packageName?: string;
  /** 模块名 */
  moduleName?: string;
  /** 业务名 */
  bizName?: string;
  /** 作者 */
  author?: string;
  /** 字段 */
  fields: any[];
}

export interface TableForm {}
