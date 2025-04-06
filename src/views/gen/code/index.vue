<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="数据库" prop="dbName">
          <el-select v-model="queryParams.dbName" placeholder="全部" clearable class="!w-[100px]">
            <el-option v-for="item in databaseList" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="表名称" prop="tbName">
          <el-input
            v-model="queryParams.tbName"
            placeholder="表名称"
            clearable
            style="width: 160px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="表描述" prop="tbComment">
          <el-input
            v-model="queryParams.tbComment"
            placeholder="表描述"
            clearable
            style="width: 160px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery"><i-ep-search />搜索</el-button>
          <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button v-permission="['gen:code:import']" type="success" @click="handleImport"
          ><i-ep-plus />导入</el-button
        >
        <el-button
          v-permission="['sys:role:edit']"
          type="warning"
          :disabled="single"
          @click="handleEdit(selectedIds[0])"
          ><i-ep-edit />编辑</el-button
        >
        <el-button
          v-permission="['sys:role:del']"
          type="danger"
          :disabled="multiple"
          @click="handleDelete()"
          ><i-ep-delete />删除</el-button
        >
      </template>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="list"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column label="数据库名" prop="dbName" align="center" width="150" />
        <el-table-column label="表名称" prop="tbName" align="center" width="200" />
        <el-table-column label="表描述" prop="tbComment" align="center" width="150" />
        <el-table-column label="实体类名称" prop="className" align="center" width="200" />
        <el-table-column label="生成包路径" prop="packageName" align="center" min-width="200" />
        <el-table-column label="模块名" prop="moduleName" align="center" width="150" />
        <el-table-column label="业务名" prop="bizName" align="center" width="150" />
        <el-table-column label="作者" prop="author" align="center" width="100" />
        <el-table-column label="创建时间" prop="createTime" align="center" width="160" />
        <el-table-column label="操作" fixed="right" align="center" width="140">
          <template #default="scope">
            <el-button type="primary" size="small" link @click="openDialog('preview', scope.row.id)"
              >预览</el-button
            >
            <el-button type="primary" size="small" link @click="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button type="primary" size="small" link @click="handleDelete(scope.row.id)"
              >删除</el-button
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
    </el-card>
    <import-table ref="importTableRef" @submitted="handleQuery" />
    <edit-table ref="editTableRef" @submitted="handleQuery" />

    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      :width="dialog.width"
      :top="dialog.top"
      @close="closeDialog"
      :close-on-click-modal="false"
      draggable
      overflow
    >
      <el-tabs v-model="previewActiveName">
        <el-tab-pane
          v-for="(value, key) in previewData"
          :label="
            key
              .toString()
              .substring(key.toString().lastIndexOf('/') + 1, key.toString().indexOf('.vm'))
          "
          :name="
            key
              .toString()
              .substring(key.toString().lastIndexOf('/') + 1, key.toString().indexOf('.vm'))
          "
          :key="key"
        >
          <el-scrollbar height="600px" class="affix-container">
            <el-affix target=".affix-container" :offset="10" style="float: right">
              <el-button @click="handleCopy(key.toString())">复制代码</el-button>
            </el-affix>
            <pre>{{ value }}</pre>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { TableQuery, TableVO } from "@/api/gen/code/types";
import { listTable, delTable, previewCode, listDatabase } from "@/api/gen/code";
import ImportTable from "@/views/gen/code/import-table.vue";
import EditTable from "@/views/gen/code/edit-table.vue";

defineOptions({
  name: "GenCode",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const importTableRef = ref();
const editTableRef = ref();

const list = ref<TableVO[]>(); // 分页数据
const total = ref(0); // 数据总数
const loading = ref(false); //  加载状态
const selectedIds = ref<number[]>([]); // 选中ID集合 用于批量操作
const single = ref(true); // 单选禁用
const multiple = ref(true); // 多选禁用
const queryParams = reactive<TableQuery>({
  page: 1,
  pageSize: 10,
  // dbName: "vector",
});
const databaseList = ref([]);
const previewActiveName = ref("entity.java");
const previewData = ref();
// 弹窗对象
const dialog = reactive({
  visible: false,
  type: "form",
  width: "500",
  top: "",
  title: "",
});

const { copy } = useClipboard();

/** 查询 */
function handleQuery() {
  loading.value = true;
  listTable(queryParams)
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
  queryFormRef.value.resetFields();
  queryParams.page = 1;
  // queryParams.dbName = "vector";
  handleQuery();
}

/** 行checkbox 选中事件 */
function handleSelectionChange(selection: any) {
  selectedIds.value = selection.map((item: any) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/**
 * 打开弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 * @param id 用户ID
 */
function openDialog(type: string, id?: number) {
  dialog.visible = true;
  dialog.type = type;

  if (dialog.type === "preview") {
    dialog.width = "100%";
    dialog.top = "5vh";
    previewActiveName.value = "entity.java";
    if (id) {
      previewCode(id).then(({ data }) => {
        previewData.value = data;
      });
    }
  }
}

/**
 * 关闭弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 */
function closeDialog() {
  dialog.visible = false;
  if (dialog.type === "preview") {
    previewData.value = {};
  }
}

function loadAllDatabase() {
  listDatabase().then(({ data }) => {
    databaseList.value = data;
  });
}

function handleImport() {
  importTableRef.value.open();
}
function handleEdit(id: number) {
  editTableRef.value.open(id);
}
/** 删除 */
function handleDelete(id?: number) {
  const ids: any = id || selectedIds.value;
  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    delTable(ids)
      .then(() => {
        ElMessage.success("删除成功");
        resetQuery();
      })
      .finally(() => (loading.value = false));
  });
}

function handleCopy(key: string) {
  copy(previewData.value[key]).then(() => {
    ElMessage.success("复制成功");
  });
}

onMounted(() => {
  loadAllDatabase();
  handleQuery();
});
</script>
