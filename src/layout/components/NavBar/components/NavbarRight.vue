<template>
  <div class="flex">
    <template v-if="!isMobile">
      <!--全屏 -->
      <div class="setting-item" @click="toggle">
        <svg-icon :icon-class="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" />
      </div>

      <!-- 布局大小 -->
      <el-tooltip :content="$t('sizeSelect.tooltip')" effect="dark" placement="bottom">
        <size-select class="setting-item" />
      </el-tooltip>

      <!-- 语言选择 -->
      <lang-select class="setting-item" />
    </template>

    <!-- 用户头像 -->
    <el-dropdown class="setting-item" trigger="click">
      <div class="flex-center h100% p10px">
        <img
          :src="userStore.user.avatar + '?imageView2/1/w/80/h/80'"
          class="rounded-full mr-10px w24px w24px"
        />
        <span>{{ userStore.user.nickname }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleChangeProfile">
            {{ $t("navbar.profile") }}
          </el-dropdown-item>
          <el-dropdown-item @click="handleChangePassword">
            {{ $t("navbar.editPassword") }}
          </el-dropdown-item>
          <el-dropdown-item @click="logout" divided>
            {{ $t("navbar.logout") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 设置 -->
    <template v-if="defaultSettings.showSettings">
      <div class="setting-item" @click="settingStore.settingsVisible = true">
        <svg-icon icon-class="setting" />
      </div>
    </template>
    <password-edit ref="passwordEditRef" />
    <profile-edit ref="profileEditRef" />
  </div>
</template>
<script setup lang="ts">
import { useAppStore, useTagsViewStore, useUserStore, useSettingsStore } from "@/store";
import defaultSettings from "@/settings";
import { DeviceEnum } from "@/enums/DeviceEnum";
import PasswordEdit from "./PasswordEdit.vue";
import ProfileEdit from "./ProfileEdit.vue";

const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
const userStore = useUserStore();
const settingStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

const isMobile = computed(() => appStore.device === DeviceEnum.MOBILE);

const { isFullscreen, toggle } = useFullscreen();

const passwordEditRef = ref();
function handleChangePassword() {
  passwordEditRef.value.open();
}

const profileEditRef = ref();
function handleChangeProfile() {
  profileEditRef.value.open();
}

/**
 * 注销
 */
function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false,
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`);
      });
  });
}
</script>
<style lang="scss" scoped>
.setting-item {
  display: inline-block;
  min-width: 40px;
  height: $navbar-height;
  line-height: $navbar-height;
  color: var(--el-text-color);
  text-align: center;
  cursor: pointer;

  &:hover {
    background: rgb(0 0 0 / 10%);
  }
}

.layout-top,
.layout-mix {
  .setting-item,
  .el-icon {
    color: var(--el-color-white);
  }
}

.dark .setting-item:hover {
  background: rgb(255 255 255 / 20%);
}
</style>
