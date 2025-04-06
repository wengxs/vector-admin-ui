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
      <el-form-item label="业务类型" prop="bizType">
        <el-select v-model="formData.bizType" placeholder="业务类型">
          <el-option label="Option 1" :value="1" />
          <el-option label="Option 2" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务单号" prop="bizNo">
        <el-input v-model="formData.bizNo" placeholder="业务单号" />
      </el-form-item>
      <el-form-item label="物流名称" prop="logisticsName">
        <el-input v-model="formData.logisticsName" placeholder="物流名称" />
      </el-form-item>
      <el-form-item label="物流单号" prop="logisticsNo">
        <el-input v-model="formData.logisticsNo" placeholder="物流单号" />
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
import { getReceive, addReceive, updateReceive } from "@/api/wms/receive";
import { ReceiveForm } from "@/api/wms/receive/types";

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
const formData = reactive<ReceiveForm>({
  details: [],
});
/** 校验规则 */
const rules = reactive({
  bizType: [{ required: true, message: "业务类型不能为空", trigger: "blur" }],
});

/** 打开窗口 */
const open = (id?: number) => {
  title.value = id ? "修改" : "新增";
  visible.value = true;
  nextTick(() => {
    if (id) {
      getReceive(id).then(({ data }) => {
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
        updateReceive(formData).then(() => {
          ElMessage.success("操作成功");
          emit("submitted");
          visible.value = false;
        });
      } else {
        addReceive(formData).then(() => {
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
