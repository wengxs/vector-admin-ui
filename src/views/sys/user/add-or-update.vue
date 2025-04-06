<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    @close="close"
    :close-on-click-modal="false"
    draggable
    overflow
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" :readonly="!!formData.id" placeholder="用户名" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="昵称" />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="手机号码" maxlength="11" />
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="formData.email" placeholder="邮箱地址" maxlength="32" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="formData.gender">
          <el-radio value="UNKNOWN">未知</el-radio>
          <el-radio value="MALE">男</el-radio>
          <el-radio value="FEMALE">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户头像" prop="avatar">
        <image-upload v-model="formData.avatar" croppable />
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input
          v-model="formData.password"
          :placeholder="
            '用户密码' + (formData.id ? '（不填则不更新密码）' : '（不填则使用默认密码）')
          "
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.userStatus">
          <el-radio value="ENABLED">正常</el-radio>
          <el-radio value="DISABLED">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-tree-select
          v-model="formData.deptId"
          placeholder="选择部门"
          :data="deptTree"
          filterable
          check-strictly
          :render-after-expand="false"
          :props="{ value: 'id', label: 'deptName' }"
        />
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-select v-model="formData.roleIds" multiple placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="备注" />
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
import { getUser, addUser, updateUser } from "@/api/sys/user";
import { getDeptTree } from "@/api/sys/dept";
import { getAllRole } from "@/api/sys/role";
import { UserForm } from "@/api/sys/user/types";
import { DeptTree } from "@/api/sys/dept/types";
import { RoleVO } from "@/api/sys/role/types";

defineComponent({
  name: "AddOrUpdate",
});
const props = defineProps({
  width: {
    type: String,
    default: "500",
  },
});
const emit = defineEmits(["submitted"]);

/** 表单 */
const formRef = ref(ElForm);
/** 窗口状态 */
const visible = ref(false);
/** 窗口标题 */
const title = ref<string>("新增");

/** 表单数据 */
const formData = reactive<UserForm>({
  userStatus: "ENABLED",
  gender: "UNKNOWN",
});
/** 校验规则 */
const rules = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  nickname: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
  deptId: [{ required: true, message: "部门不能为空", trigger: "blur" }],
  roleIds: [{ required: true, message: "用户角色不能为空", trigger: "blur" }],
  mobile: [
    { required: true, message: "手机号码不能为空", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

/** 部门数据 */
const deptTree = ref<DeptTree[]>([]);
/** 角色数据 */
const roleList = ref<RoleVO[]>([]);

/** 加载部门数据源 */
const loadDeptTree = async () => {
  getDeptTree().then((response) => {
    deptTree.value = response.data;
  });
};
/** 加载角色数据源 */
const loadRoleOptions = async () => {
  getAllRole().then((response) => {
    roleList.value = response.data;
  });
};

/** 打开窗口 */
const open = (id: number) => {
  title.value = id ? "修改" : "新增";
  visible.value = true;
  nextTick(async () => {
    await loadDeptTree();
    await loadRoleOptions();
    if (id) {
      getUser(id).then(({ data }) => {
        Object.assign(formData, data);
      });
    }
  });
};

/** 关闭窗口 */
const close = () => {
  formRef.value.resetFields();
  formRef.value.clearValidate();
  Object.keys(formData).forEach((key) => {
    (formData as {[key: string]: any})[key] = undefined;
  });
  formData.userStatus = "ENABLED";
  formData.gender = "UNKNOWN";
};

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      const id = formData.id;
      if (id) {
        updateUser(formData).then(() => {
          ElMessage.success("修改成功");
          emit("submitted");
          visible.value = false;
        });
      } else {
        addUser(formData).then(() => {
          ElMessage.success("新增成功");
          emit("submitted");
          visible.value = false;
        });
      }
    }
  });
}, 3000);

/** 暴露方法 */
defineExpose({
  open,
});
</script>
