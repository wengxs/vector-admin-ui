/**
 * 登录用户信息
 */
export interface LoginUser {
  userId?: number;
  username?: string;
  nickname?: string;
  mobile?: string;
  avatar?: string;
  roles: string[];
  permissions: string[];
}

/**
 * 修改密码表单类型
 */
export interface PasswordForm {
  oldPassword?: string;
  newPassword?: string;
  rePassword?: string;
}

export interface ProfileForm {
  username?: string;
  avatar?: string;
  mobile?: string;
}
