<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :top="top"
    @close="close"
    :close-on-click-modal="false"
    draggable
    overflow
  >
    <div>
      <el-form :inline="true" :model="tableData">
        <el-form-item label="数据库名" prop="dbName">
          <el-input v-model="tableData.dbName" placeholder="数据库名" disabled />
        </el-form-item>
        <el-form-item label="表名称" prop="tbName">
          <el-input v-model="tableData.tbName" placeholder="表名称" disabled />
        </el-form-item>
        <el-form-item label="表描述" prop="tbComment">
          <el-input v-model="tableData.tbComment" placeholder="表描述" />
        </el-form-item>
        <el-form-item label="包路径" prop="packageName">
          <el-input v-model="tableData.packageName" placeholder="包路径" />
        </el-form-item>
        <el-form-item label="实体类名称" prop="className">
          <el-input v-model="tableData.className" placeholder="实体类名称" />
        </el-form-item>
        <el-form-item label="模块名" prop="moduleName">
          <el-input v-model="tableData.moduleName" placeholder="模块名" />
        </el-form-item>
        <el-form-item label="业务名" prop="bizName">
          <el-input v-model="tableData.bizName" placeholder="业务名" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="tableData.author" placeholder="作者" />
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="tableData.fields" border>
        <el-table-column label="字段名称" prop="name" align="center" width="120" />
        <el-table-column label="字段描述" prop="comment" align="center" width="120">
          <template #default="scope">
            <el-input
              v-model="scope.row.comment"
              placeholder="字段描述"
              :disabled="scope.row.isPk"
            />
          </template>
        </el-table-column>
        <el-table-column label="字段类型" prop="type" align="center" width="100" />
        <el-table-column label="JAVA类型" prop="javaType" align="center" width="100">
          <template #default="scope">
            <el-input
              v-model="scope.row.javaType"
              placeholder="JAVA类型"
              :disabled="scope.row.isPk"
            />
          </template>
        </el-table-column>
        <el-table-column label="JAVA字段名" prop="javaField" align="center" width="120" />
        <el-table-column label="必填" prop="isRequired" align="center" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isRequired"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column label="表单填写" prop="isForm" align="center" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isForm"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              :disabled="scope.row.isPk"
            />
          </template>
        </el-table-column>
        <el-table-column label="表单控件类型" prop="formComponent" align="center" width="140">
          <template #default="scope">
            <el-select
              v-model="scope.row.formComponent"
              placeholder="表单控件类型"
              :disabled="scope.row.isPk"
            >
              <el-option
                v-for="item in formComponentOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="列表字段" prop="isList" align="center" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isList"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              :disabled="scope.row.isPk"
            />
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" width="100">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.sort"
              :min="1"
              controls-position="right"
              style="width: 100%"
              :disabled="scope.row.isPk"
            />
          </template>
        </el-table-column>
        <el-table-column label="查询字段" prop="isQuery" align="center" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isQuery"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              :disabled="scope.row.isPk"
            />
          </template>
        </el-table-column>
        <el-table-column label="查询方式" prop="queryType" align="center" width="140">
          <template #default="scope">
            <el-select
              v-model="scope.row.queryType"
              placeholder="查询方式"
              :disabled="scope.row.isPk"
            >
              <el-option
                v-for="item in queryTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="查询控件类型" prop="queryComponent" align="center" width="140">
          <template #default="scope">
            <el-select
              v-model="scope.row.queryComponent"
              placeholder="查询控件类型"
              :disabled="scope.row.isPk"
            >
              <el-option
                v-for="item in queryComponentOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">保 存</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { getTable, updateTable } from "@/api/dev/codeGen";
import { TableVO } from "@/api/dev/codeGen/types";
import { Check, Close } from "@element-plus/icons-vue";

defineComponent({
  name: "EditTable",
});
const props = defineProps({
  width: {
    type: String,
    default: "100%",
  },
  top: {
    type: String,
    default: "0vh",
  },
});
const emit = defineEmits(["submitted"]);

const visible = ref(false);

const title = ref<string>(""); // 标题
const tableData = reactive<TableVO>({
  fields: [],
}); // 数据
const loading = ref(false); //  加载状态
/** 查询类型 */
const queryTypeOptions = ref<OptionType[]>([
  { value: "EQ", label: "等于" },
  { value: "LIKE", label: "模糊" },
]);

/** 表单组件类型 */
const queryComponentOptions = ref<OptionType[]>([
  { value: "INPUT", label: "输入框" },
  { value: "SELECT", label: "下拉选择" },
]);

/** 表单组件类型 */
const formComponentOptions = ref<OptionType[]>([
  { value: "INPUT", label: "输入框" },
  { value: "SELECT", label: "下拉选择" },
  { value: "SWITCH", label: "开关" },
  { value: "CHECKBOX", label: "多选框" },
  { value: "RADIO", label: "单选框" },
  { value: "NUMBER", label: "数字输入框" },
  { value: "DATE", label: "日期选择器" },
]);

const open = (id: number) => {
  title.value = "修改表生成信息";
  visible.value = true;
  loading.value = true;
  getTable(id).then(({ data }) => {
    Object.assign(tableData, { ...data });
    loading.value = false;
  });
};

defineExpose({
  open,
});

const close = () => {
  Object.keys(tableData).forEach((key) => {
    (tableData as {[key: string]: any})[key] = undefined;
  });
};

const handleSubmit = () => {
  updateTable(tableData).then(() => {
    ElMessage.success("保存成功");
    emit("submitted");
    visible.value = false;
  });
};
</script>
