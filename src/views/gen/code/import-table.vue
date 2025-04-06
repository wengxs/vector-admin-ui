<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :top="top"
    append-to-body
    @close="close"
    :close-on-click-modal="false"
    draggable
    overflow
  >
    <el-select
      v-model="queryParams.dbName"
      placeholder="请选择数据库"
      clearable
      @change="resetQuery"
      class="!w-[200px]">
      <el-option v-for="item in databaseList" :label="item" :value="item" />
    </el-select>
    <el-table
      v-loading="loading"
      :data="list"
      highlight-current-row
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="数据库" prop="dbName" align="left" width="160" />
      <el-table-column label="表名" prop="tbName" align="left" width="200" />
      <el-table-column label="描述" prop="tbComment" align="left" />
      <el-table-column label="更新时间" prop="createTime" align="center" width="160" />
      <el-table-column label="操作" align="center" width="80" fixed="right">
        <template #default="scope">
          <el-button
            v-permission="['gen:code:import']"
            type="primary"
            size="small"
            link
            @click="handleImport(scope.row.dbName, scope.row.tbName)"
            >导入</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-if="total > 0"
      v-model:total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.pageSize"
      @pagination="handleQuery"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { listDbTable, importTable, listDatabase } from "@/api/gen/code";
import { TableQuery, TableVO } from "@/api/gen/code/types";

defineComponent({
  name: "ImportTable",
});
const props = defineProps({
  width: {
    type: String,
    default: "800",
  },
  top: {
    type: String,
    default: "5vh",
  },
});

const emit = defineEmits(["submitted"]);

const visible = ref(false);

const title = ref<string>(""); // 标题
const list = ref<TableVO[]>(); // 分页数据
const total = ref(0); // 数据总数
const loading = ref(false); //  加载状态
const selectTables = ref<string[]>([]); // 选中ID集合 用于批量操作
const single = ref(true); // 单选禁用
const multiple = ref(true); // 多选禁用
const queryParams = reactive<TableQuery>({
  page: 1,
  pageSize: 10,
  // dbName: "vector_boot",
});
const databaseList = ref([]);

/** 查询 */
function handleQuery() {
  loading.value = true;
  listDbTable(queryParams)
    .then(({ data }) => {
      list.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}
/** 重置查询 */
function resetQuery() {
  // queryFormRef.value.resetFields();
  queryParams.page = 1;
  // queryParams.dbName = "vector_boot";
  handleQuery();
}

/** 行checkbox 选中事件 */
function handleSelectionChange(selection: any) {
  selectTables.value = selection.map((item: any) => item.tableName);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

const open = () => {
  title.value = "导入数据库表";
  visible.value = true;
  loadAllDatabase();
  // resetQuery();
};

defineExpose({
  open,
});

const close = () => {
  visible.value = false;
  queryParams.dbName = undefined;
  list.value = [];
  total.value = 0;
};

function handleImport(dbName: string, tbName: string) {
  const tbNames: any = tbName || selectTables.value;
  if (!tbNames) {
    ElMessage.warning("请勾选导入项");
    return;
  }
  ElMessageBox.confirm("确认导入已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    importTable(dbName, tbNames)
      .then(() => {
        ElMessage.success("导入成功");
        emit("submitted");
        resetQuery();
      })
      .finally(() => (loading.value = false));
  });
}

function loadAllDatabase() {
  listDatabase().then(({ data }) => {
    databaseList.value = data;
  });
}
</script>
