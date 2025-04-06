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
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="formData.dictName" placeholder="字典名称" />
      </el-form-item>
      <el-form-item label="字典键" prop="dictKey">
        <el-input v-model="formData.dictKey" placeholder="字典键" />
      </el-form-item>
      <el-form-item label="字典状态" prop="dictStatus">
        <el-radio-group v-model="formData.dictStatus">
          <el-radio value="ENABLED">启用</el-radio>
          <el-radio value="DISABLED">禁用</el-radio>
        </el-radio-group>
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
import { getDict, addDict, updateDict } from "@/api/sys/dict";
import { DictForm } from "@/api/sys/dict/types";

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
const formData = reactive<DictForm>({
  dictStatus: "ENABLED"
});
/** 校验规则 */
const rules = reactive({
  dictName: [{ required: true, message: "字典名称不能为空", trigger: "blur" }],
  dictKey: [{ required: true, message: "字典键不能为空", trigger: "blur" }],
  dictStatus: [{ required: true, message: "字典状态不能为空", trigger: "blur" }],
});

/** 打开窗口 */
const open = (id?: number) => {
  title.value = id ? "修改" : "新增";
  visible.value = true;
  nextTick(() => {
    if (id) {
      getDict(id).then(({ data }) => {
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
  formData.dictStatus = "ENABLED";
};

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      if (formData.id) {
        updateDict(formData).then(() => {
          ElMessage.success("操作成功");
          emit("submitted");
          visible.value = false;
        });
      } else {
        addDict(formData).then(() => {
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
