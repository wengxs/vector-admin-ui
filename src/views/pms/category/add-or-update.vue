<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    append-to-body
    @close="close"
    :close-on-click-modal="false"
    draggable
    overflow
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="父级分类" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          placeholder="选择上级分类"
          :data="categoryTree"
          filterable
          check-strictly
          :render-after-expand="false"
          :props="{ value: 'id', label: 'categoryName' }"
        />
      </el-form-item>
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="formData.categoryName" placeholder="分类名称" />
      </el-form-item>
      <el-form-item label="分类图标" prop="icon">
        <el-input v-model="formData.icon" placeholder="图标" />
      </el-form-item>
      <el-form-item label="分类排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" />
      </el-form-item>
      <el-form-item label="是否展示" prop="displayed">
        <el-switch v-model="formData.displayed" />
      </el-form-item>
    </el-form>
    <!-- 弹窗底部操作按钮 -->
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
import { getCategory, addCategory, updateCategory, getCategoryTree } from "@/api/pms/category";
import { CategoryForm, CategoryTreeVO } from "@/api/pms/category/types";

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
// Dialog状态
const visible = ref(false);
// 表单
const formRef = ref(ElForm);
// 标题
const title = ref<string>("");
// 表单数据
const formData = reactive<CategoryForm>({
  parentId: 0,
  level: 1,
  sort: 1,
  displayed: false,
});
// 校验规则
const rules = reactive({
  categoryName: [{ required: true, message: "分类名称不能为空", trigger: "blur" }],
  icon: [{ required: true, message: "分类图标不能为空", trigger: "blur" }],
  parentId: [{ required: true, message: "父级分类不能为空", trigger: "blur" }],
  sort: [{ required: true, message: "分类排序不能为空", trigger: "blur" }],
});

const categoryTree = ref<CategoryTreeVO[]>([]);

const loadCategoryTree = () => {
  getCategoryTree().then(({ data }) => {
    categoryTree.value = [{ id: 0, categoryName: "顶级分类", children: data }];
  });
};

/** 打开窗口 */
const open = (id: number) => {
  formData.id = id;
  title.value = id ? "修改" : "新增";
  visible.value = true;
  loadCategoryTree();
  nextTick(() => {
    if (id) {
      getCategory(id).then(({ data }) => {
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

defineExpose({
  open,
});

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      if (formData.id) {
        updateCategory(formData).then(() => {
          ElMessage.success("操作成功");
          emit("submitted");
          visible.value = false;
        });
      } else {
        addCategory(formData).then(() => {
          ElMessage.success("操作成功");
          emit("submitted");
          visible.value = false;
        });
      }
    }
  });
}, 3000);
</script>
