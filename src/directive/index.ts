import type { App } from "vue";

import { permission, role } from "./permission";

// 全局注册 directive
export function setupDirective(app: App<Element>) {
  // 使 v-permission 在所有组件中都可用
  app.directive("permission", permission);
  app.directive("role", role);
}
