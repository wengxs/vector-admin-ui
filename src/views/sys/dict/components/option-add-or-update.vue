<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    @close="close"
    :close-on-click-modal="false"
    draggable
    overflow
    append-to-body
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="字典键" prop="dictKey">
        <el-input v-model="formData.dictKey" placeholder="字典键" />
      </el-form-item>
      <el-form-item label="标签" prop="optionLabel">
        <el-input v-model="formData.optionLabel" placeholder="标签" />
      </el-form-item>
      <el-form-item label="项值" prop="optionValue">
        <el-input v-model="formData.optionValue" placeholder="项值" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" />
      </el-form-item>
      <el-form-item label="选项状态" prop="optionStatus">
        <el-radio-group v-model="formData.optionStatus">
          <el-radio value="ENABLED">启用</el-radio>
          <el-radio value="DISABLED">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="样式" prop="style">
        <el-radio-group v-model="formData.style">
          <el-radio value="">none</el-radio>
          <el-radio value="primary"><el-tag type="primary">primary</el-tag></el-radio>
          <el-radio value="success"><el-tag type="success">success</el-tag></el-radio>
          <el-radio value="info"><el-tag type="info">info</el-tag></el-radio>
          <el-radio value="warning"><el-tag type="warning">warning</el-tag></el-radio>
          <el-radio value="danger"><el-tag type="danger">danger</el-tag></el-radio>
        </el-radio-group>
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
import { getDictOption, addDictOption, updateDictOption } from "@/api/sys/dict";
import { DictOptionForm } from "@/api/sys/dict/types";

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
const formData = reactive<DictOptionForm>({
  sort: 1,
  optionStatus: "ENABLED",
  style: "",
});
/** 校验规则 */
const rules = reactive({
  dictKey: [{ required: true, message: "字典键不能为空", trigger: "blur" }],
  optionLabel: [{ required: true, message: "标签不能为空", trigger: "blur" }],
  optionValue: [{ required: true, message: "项值不能为空", trigger: "blur" }],
  sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
  optionStatus: [{ required: true, message: "选项状态不能为空", trigger: "blur" }],
});

/** 打开窗口 */
const open = (dictKey: string, id?: number) => {
  title.value = id ? "修改" : "新增";
  visible.value = true;
  nextTick(() => {
    if (id) {
      getDictOption(id).then(({ data }) => {
        Object.assign(formData, { ...data });
      });
    } else {
      formData.dictKey = dictKey;
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
  formData.optionStatus = "ENABLED";
  formData.style = "";
  formData.sort = 1;
};

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      if (formData.id) {
        updateDictOption(formData).then(() => {
          ElMessage.success("操作成功");
          emit("submitted");
          visible.value = false;
        });
      } else {
        addDictOption(formData).then(() => {
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
