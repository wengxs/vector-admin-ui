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
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="formData.productName" placeholder="产品名称" />
      </el-form-item>
      <el-form-item label="生产厂家" prop="factory">
        <el-input v-model="formData.factory" placeholder="生产厂家" />
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
import { getProduct, addProduct, updateProduct } from "@/api/pms/product";
import { ProductForm } from "@/api/pms/product/types";

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
const formData = reactive<ProductForm>({});
/** 校验规则 */
const rules = reactive({
  productName: [{ required: true, message: "产品名称不能为空", trigger: "blur" }],
});

/** 打开窗口 */
const open = (id?: number) => {
  title.value = id ? "修改" : "新增";
  visible.value = true;
  nextTick(() => {
    if (id) {
      getProduct(id).then(({ data }) => {
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
        updateProduct(formData).then(() => {
          ElMessage.success("操作成功");
          emit("submitted");
          visible.value = false;
        });
      } else {
        addProduct(formData).then(() => {
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
