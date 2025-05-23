import { useUserStoreHook } from "@/store/modules/user";
import { Directive, DirectiveBinding } from "vue";

/**
 * 按钮权限
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 「超级管理员」拥有所有的按钮权限
    const { roles, permissions } = useUserStoreHook().user;
    if (roles.includes("*") || roles.includes("admin") || permissions.includes("*:*:*")) {
      return true;
    }
    // 「其他角色」按钮权限校验
    const { value } = binding;
    if (value) {
      const requiredPerms = value; // DOM绑定需要的按钮权限标识

      const hasPerm = permissions?.some((permission) => {
        return requiredPerms.includes(permission);
      });

      if (!hasPerm) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error("need permissions! Like v-has-perm=\"['sys:user:add','sys:user:edit']\"");
    }
  },
};

/**
 * 角色权限
 */
export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;

    if (value) {
      const requiredRoles = value; // DOM绑定需要的角色编码
      const { roles } = useUserStoreHook().user;
      const hasRole = roles.some((perm) => {
        return requiredRoles.includes(perm);
      });

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error("need roles! Like v-has-role=\"['admin','test']\"");
    }
  },
};
