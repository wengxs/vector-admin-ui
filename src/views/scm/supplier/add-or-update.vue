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
      <el-form-item label="供应商" prop="supplierName">
        <el-input v-model="formData.supplierName" placeholder="供应商" />
      </el-form-item>
      <el-form-item label="联系人" prop="contacts">
        <el-input v-model="formData.contacts" placeholder="联系人" />
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="联系电话" />
      </el-form-item>
      <el-form-item label="所在省份" prop="province">
        <el-input v-model="formData.province" placeholder="所在省份" />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="formData.address" placeholder="详细地址" />
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
import { getSupplier, addSupplier, updateSupplier } from "@/api/scm/supplier";
import { SupplierForm } from "@/api/scm/supplier/types";

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
const formData = reactive<SupplierForm>({});
/** 校验规则 */
const rules = reactive({
  supplierName: [{ required: true, message: "供应商不能为空", trigger: "blur" }],
});

/** 打开窗口 */
const open = (id?: number) => {
  title.value = id ? "修改" : "新增";
  visible.value = true;
  nextTick(() => {
    if (id) {
      getSupplier(id).then(({ data }) => {
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
    formData[key] = undefined;
  });
};

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      if (formData.id) {
        updateSupplier(formData).then(() => {
          ElMessage.success("操作成功");
          emit("submitted");
          visible.value = false;
        });
      } else {
        addSupplier(formData).then(() => {
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
