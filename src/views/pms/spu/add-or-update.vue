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
      <el-form-item label="商品标题" prop="spuName">
        <el-input v-model="formData.spuName" placeholder="商品标题" />
      </el-form-item>
      <el-form-item label="默认图片" prop="defaultImage">
        <el-input v-model="formData.defaultImage" placeholder="默认图片" />
      </el-form-item>
      <el-form-item label="商品分类" prop="categoryId">
        <el-tree-select
          v-model="formData.categoryId"
          placeholder="商品分类"
          :data="categoryTree"
          filterable
          check-strictly
          :render-after-expand="false"
          :props="{ value: 'id', label: 'categoryName' }"
        />
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
import { getSpu, addSpu, updateSpu } from "@/api/pms/spu";
import { getCategoryTree } from "@/api/pms/category";
import { SpuForm } from "@/api/pms/spu/types";
import { CategoryTreeVO } from "@/api/pms/category/types";

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
const formData = reactive<SpuForm>({});
/** 校验规则 */
const rules = reactive({
  spuName: [{ required: true, message: "商品标题不能为空", trigger: "blur" }],
  defaultImage: [{ required: true, message: "默认图片不能为空", trigger: "blur" }],
  categoryId: [{ required: true, message: "请选择商品分类", trigger: "blur" }],
});

const categoryTree = ref<CategoryTreeVO[]>([]);

const loadCategoryTree = () => {
  getCategoryTree().then(({ data }) => {
    categoryTree.value = data;
  });
};

/** 打开窗口 */
const open = (id?: number) => {
  title.value = id ? "修改" : "新增";
  visible.value = true;
  nextTick(() => {
    loadCategoryTree();
    if (id) {
      getSpu(id).then(({ data }) => {
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
        updateSpu(formData).then(() => {
          ElMessage.success("操作成功");
          emit("submitted");
          visible.value = false;
        });
      } else {
        addSpu(formData).then(() => {
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
