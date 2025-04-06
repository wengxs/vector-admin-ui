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
      <div class="search-container" style="box-shadow: none">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item label="字典名称" prop="dictName">
            <el-input
              v-model="queryParams.dictName"
              placeholder="字典名称"
              disabled
            />
          </el-form-item>
          <el-form-item label="字典键" prop="dictKey">
            <el-input
              v-model="queryParams.dictKey"
              placeholder="字典键"
              disabled />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery"><i-ep-refresh />刷新</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-card shadow="never" class="table-container">
        <template #header>
          <el-button
            v-permission="['sys:dict:add']"
            type="success"
            @click="handleAdd"
          ><i-ep-plus />新增</el-button
          >
        </template>
        <el-table
          v-loading="loading"
          :data="list"
          border
        >
          <el-table-column label="标签" prop="optionLabel" align="center" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.style" :type="scope.row.style" v-text="scope.row.optionLabel" />
              <span v-else v-text="scope.row.optionLabel" />
            </template>
          </el-table-column>
          <el-table-column label="项值" prop="optionValue" align="center" min-width="120" />
          <el-table-column label="选项状态" prop="optionStatus" align="center" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.optionStatus === 'ENABLED'" type="success">启用</el-tag>
              <el-tag v-if="scope.row.optionStatus === 'DISABLED'" type="info">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="sort" align="center" width="120" />
          <el-table-column label="样式" prop="style" align="center" width="120" />
          <el-table-column label="操作" fixed="right" align="center" width="120">
            <template #default="scope">
              <el-button
                v-permission="['sys:dict:edit']"
                type="primary"
                size="small"
                link
                @click="handleEdit(scope.row.id)"
              >编辑</el-button
              >
              <el-button
                v-permission="['sys:dict:del']"
                type="primary"
                size="small"
                link
                @click="handleDel(scope.row.id)"
              >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 新增/修改 -->
    <add-or-update ref="addOrUpdateRef" @submitted="handleQuery" />
  </el-dialog>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import {getDict, listDictOption, addDictOption, updateDictOption, delDictOption} from "@/api/sys/dict";
import { DictOptionVO, DictVO } from "@/api/sys/dict/types";
import AddOrUpdate from "./option-add-or-update.vue";

defineComponent({
  name: "dictOption",
});
const props = defineProps({
  width: {
    type: String,
    default: "800px",
  },
  top: {
    type: String,
  },
});
const emit = defineEmits(["submitted"]);

const addOrUpdateRef = ref();
const visible = ref(false);
const title = ref<string>("字典数据"); // 标题
const list = ref<DictOptionVO[]>([]); // 列表数据
const loading = ref(false); //  加载状态
const queryParams = reactive<any>({});

/** 选项状态 */
const statusOptions = ref<OptionType[]>([
  { value: "ENABLED", label: "启用" },
  { value: "DISABLED", label: "禁用" },
]);

/** 标签样式 */
const styleOptions = ref<OptionType[]>([
  { value: "", label: "default" },
  { value: "success", label: "success" },
  { value: "info", label: "info" },
  { value: "warning", label: "warning" },
  { value: "danger", label: "danger" },
]);

const open = (id: number) => {
  visible.value = true;
  getDict(id).then(({ data }) => {
    Object.assign(queryParams, { ...data });
  }).then(() => {
    handleQuery();
  });
};

defineExpose({
  open,
});

const close = () => {
  Object.keys(queryParams).forEach((key) => {
    queryParams[key] = undefined;
  });
};

/** 查询 */
function handleQuery() {
  // 重置父组件
  loading.value = true;
  listDictOption(<string>queryParams.dictKey)
    .then(({ data }) => {
      list.value = data;
    }).then(() => {
      loading.value = false;
    });
}

/** 新增 */
function handleAdd() {
  nextTick(() => {
    addOrUpdateRef.value.open(queryParams.dictKey, undefined);
  });
}

/** 修改 */
function handleEdit(id: number) {
  nextTick(() => {
    addOrUpdateRef.value.open(undefined, id);
  });
}

function handleDel(id: number) {
  ElMessageBox.confirm("确认删除已选中的数据项？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    delDictOption(id).then(() => {
      ElMessage.success("操作成功");
      handleQuery();
    });
  });
}
</script>
