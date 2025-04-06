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
      <el-form-item label="当前密码" prop="oldPassword">
        <el-input type="password" v-model="formData.oldPassword" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新的密码" prop="newPassword">
        <el-input type="password" v-model="formData.newPassword" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="rePassword">
        <el-input type="password" v-model="formData.rePassword" autocomplete="off" />
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
import { updatePassword } from "@/api/sys/current";
import { PasswordForm } from "@/api/sys/current/types";

defineComponent({
  name: "PasswordEdit",
});
/** 表单 */
const formRef = ref(ElForm);
/** 窗口状态 */
const visible = ref(false);
/** 窗口标题 */
const title = ref<string>("修改密码");

/** 表单数据 */
const formData = reactive<PasswordForm>({});

/** 校验规则 */
const rules = reactive({
  oldPassword: [{ required: true, message: "请输入当前密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新的密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6个字符", trigger: "blur" },
  ],
  rePassword: [
    {
      required: true,
      validator: (rule: any, value: string, callback: any) => {
        if (value !== formData.newPassword) {
          return callback(new Error());
        }
        return callback();
      },
      message: "两次输入密码不一致",
      trigger: "blur",
    },
  ],
});

/** 打开窗口 */
const open = () => {
  visible.value = true;
};

/** 关闭窗口 */
const close = () => {
  formRef.value.resetFields();
  formRef.value.clearValidate();
  Object.keys(formData).forEach((key) => {
    (formData as {[key: string]: any})[key] = undefined;
  });
};

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      updatePassword(formData).then(() => {
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
