import type { App } from "vue";
import { setupRouter } from "@/router";
import { setupStore } from "@/store";
import { setupDirective } from "@/directive";
import { setupI18n } from "@/lang"
import { setupElIcons } from "./icons";
import { setupPermission } from "./permission";

export default {
  install(app: App<Element>) {
    setupI18n(app);
    setupRouter(app);
    setupStore(app);
    setupDirective(app);
    setupElIcons(app);
    setupPermission();
  },
}
