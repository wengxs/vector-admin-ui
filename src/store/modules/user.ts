import { loginApi, logoutApi } from "@/api/auth";
import { getLoginUser, updateProfile } from "@/api/sys/current";
import { resetRouter } from "@/router";
import { store } from "@/store";

import { LoginData } from "@/api/auth/types";
import { LoginUser, ProfileForm } from "@/api/sys/current/types";

export const useUserStore = defineStore("user", () => {
  const user = ref<LoginUser>({
    roles: [],
    permissions: [],
  });

  /**
   * 登录
   *
   * @returns
   * @param loginData
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then((response) => {
          const accessToken = response.data;
          localStorage.setItem("accessToken", typeof accessToken == "string" ?
            accessToken : accessToken["access_token"]); // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getUserInfo() {
    return new Promise<LoginUser>((resolve, reject) => {
      getLoginUser()
        .then(({ data }) => {
          if (!data) {
            reject("Verification failed, please Login again.");
            return;
          }
          if (!data.roles || data.roles.length <= 0) {
            reject("getUserInfo: roles must be a non-null array!");
            return;
          }
          Object.assign(user.value, { ...data });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          localStorage.setItem("accessToken", "");
          location.reload(); // 清空路由
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // remove token
  function resetToken() {
    console.log("resetToken");
    return new Promise<void>((resolve) => {
      localStorage.setItem("accessToken", "");
      resetRouter();
      resolve();
    });
  }

  function updateUserInfo(profileForm: ProfileForm) {
    return new Promise<void>((resolve, reject) => {
      updateProfile(profileForm)
        .then((response) => {
          Object.assign(user.value, profileForm);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return {
    user,
    login,
    getUserInfo,
    updateUserInfo,
    logout,
    resetToken,
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
