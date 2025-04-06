<template>
  <el-dialog
    v-model="visible"
    :title="title"
    @close="close"
    :close-on-click-modal="false"
    draggable
    overflow
    width="500"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="用户名" readonly />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="手机号码" maxlength="11" />
      </el-form-item>
      <el-form-item label="用户头像" prop="avatar">
        <image-upload v-model="formData.avatar" croppable />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ProfileForm } from "@/api/sys/current/types";
import { useUserStore } from "@/store";

defineComponent({
  name: "ProfileEdit",
});
const userStore = useUserStore();
/** 表单 */
const formRef = ref(ElForm);
/** 窗口状态 */
const visible = ref(false);
/** 窗口标题 */
const title = ref<string>("个人中心");

/** 表单数据 */
const formData = reactive<ProfileForm>({});

/** 校验规则 */
const rules = reactive({
  mobile: [
    { required: true, message: "手机号码不能为空", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

/** 打开窗口 */
const open = () => {
  visible.value = true;
  formData.username = userStore.user.username;
  formData.mobile = userStore.user.mobile;
  formData.avatar = userStore.user.avatar;
};

/** 关闭窗口 */
const close = () => {
  formRef.value.resetFields();
  formRef.value.clearValidate();
};

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      userStore.updateUserInfo(formData).then(() => {
        ElMessage.success("修改成功");
        visible.value = false;
      });
    }
  });
}, 3000);

/** 暴露方法 */
defineExpose({
  open,
});
</script>
