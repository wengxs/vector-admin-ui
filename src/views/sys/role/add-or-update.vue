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
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="角色编码" prop="roleKey">
        <el-input v-model="formData.roleKey" placeholder="请输入角色编码" />
      </el-form-item>
      <el-form-item label="数据权限" prop="dataScope">
        <el-select v-model="formData.dataScope">
          <el-option label="全部数据" value="All" />
          <el-option label="部门及子部门数据" value="DEPT_AND_CHILD" />
          <el-option label="本部门数据" value="DEPT" />
          <el-option label="本人数据" value="SELF" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input v-model="formData.description" placeholder="角色描述" />
      </el-form-item>
      <el-form-item label="角色权限" prop="menuIds">
        <el-scrollbar max-height="300px" style="width: 100%">
          <el-tree
            ref="menuTreeRef"
            :data="menuTree"
            empty-text="加载中，请稍后"
            node-key="id"
            :props="{ label: 'menuName' }"
            show-checkbox
          />
        </el-scrollbar>
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
import { getRole, addRole, updateRole } from "@/api/sys/role";
import { getMenuTree } from "@/api/sys/menu";
import { RoleForm } from "@/api/sys/role/types";
import { MenuTreeVO } from "@/api/sys/menu/types";

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
const menuTreeRef = ref(ElTree);
/** 窗口状态 */
const visible = ref(false);
/** 窗口标题 */
const title = ref<string>("新增");

/** 表单数据 */
const formData = reactive<RoleForm>({
  roleName: "",
  roleKey: "",
  dataScope: "ALL",
});
/** 校验规则 */
const rules = reactive({
  roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  roleKey: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
  dataScope: [{ required: true, message: "请选择数据权限", trigger: "blur" }],
});

/** 菜单权限数据 */
const menuTree = ref<MenuTreeVO[]>([]);

/** 加载菜单数据源 */
const loadMenuTree = async () => {
  getMenuTree().then(({ data }) => {
    menuTree.value = data;
  });
};

/** 打开窗口 */
const open = (id?: number) => {
  title.value = id ? "修改" : "新增";
  visible.value = true;
  nextTick(async () => {
    await loadMenuTree();
    if (id) {
      getRole(id).then(({ data }) => {
        Object.assign(formData, data);
        menuTreeRef.value.setCheckedKeys(data.menuIds, false);
      });
    }
  });
};

/** 关闭窗口 */
const close = () => {
  formRef.value.resetFields();
  formRef.value.clearValidate();
  menuTreeRef.value.setCheckedKeys([], false);
  Object.keys(formData).forEach((key) => {
    (formData as {[key: string]: any})[key] = undefined;
  });
  formData.dataScope = "ALL";
};

const getMenuAllCheckedKeys = () => {
  let keys = menuTreeRef.value.getCheckedKeys();
  return keys.concat(menuTreeRef.value.getHalfCheckedKeys());
}

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  formData.menuIds = getMenuAllCheckedKeys();
  formRef.value.validate((valid: any) => {
    if (valid) {
      const id = formData.id;
      if (id) {
        updateRole(formData).then(() => {
          ElMessage.success("修改成功");
          emit("submitted");
          visible.value = false;
        });
      } else {
        addRole(formData).then(() => {
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
