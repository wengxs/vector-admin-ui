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
      <el-form-item label="上级部门" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          placeholder="选择上级部门"
          :data="deptTree"
          filterable
          check-strictly
          :render-after-expand="false"
          :props="{ value: 'id', label: 'deptName' }"
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="formData.deptName" placeholder="部门名称" />
      </el-form-item>
      <el-form-item label="部门领导" prop="leader">
        <el-input v-model="formData.leader" placeholder="部门领导" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="formData.phone" placeholder="联系电话" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="邮箱" />
      </el-form-item>
      <el-form-item label="部门状态" prop="deptStatus">
        <el-radio-group v-model="formData.deptStatus">
          <el-radio value="ENABLED">正常</el-radio>
          <el-radio value="DISABLED">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="备注" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" />
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
import { getDept, getDeptTree, addDept, updateDept } from "@/api/sys/dept";
import { DeptForm, DeptTree } from "@/api/sys/dept/types";

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
const formData = reactive<DeptForm>({
  parentId: 0,
  sort: 1,
  deptStatus: 'ENABLED',
});
/** 校验规则 */
const rules = reactive({
  parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
  deptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
  deptStatus: [{ required: true, message: "部门状态不能为空", trigger: "blur" }],
  sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
});

const deptTree = ref<DeptTree[]>([]);

/** 打开窗口 */
const open = (parentId?: number, id?: number) => {
  title.value = id ? "修改" : "新增";
  formData.parentId = parentId;
  getDeptTree()
    .then(({ data }) => {
      deptTree.value = [{ id: 0, deptName: "顶级部门", children: data }];
    })
    .then(() => {
      visible.value = true;
      if (id) {
        getDept(id).then(({ data }) => {
          Object.assign(formData, { ...data });
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
  formData.parentId = 0;
  formData.sort = 1;
  formData.deptStatus = 'ENABLED';
};

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      if (formData.id) {
        updateDept(formData).then(() => {
          ElMessage.success("操作成功");
          emit("submitted");
          visible.value = false;
        });
      } else {
        addDept(formData).then(() => {
          ElMessage.success("操作成功");
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
