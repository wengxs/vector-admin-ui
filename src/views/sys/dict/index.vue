<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="创建时间">
          <el-date-picker
            class="!w-[240px]"
            v-model="dateTimeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="截止时间"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="字典名称" prop="dictName">
          <el-input
            v-model="queryParams.dictName"
            placeholder="字典名称"
            style="width: 160px"
            clearable
          />
        </el-form-item>
        <el-form-item label="字典状态" prop="dictStatus">
          <el-select
            v-model="queryParams.dictStatus"
            placeholder="字典状态"
            style="width: 160px"
            clearable
          >
            <el-option label="label" value="value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><i-ep-search />搜索</el-button>
          <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button v-permission="['sys:dict:add']" type="success" @click="handleAdd"
        ><i-ep-plus />新增</el-button
        >
        <el-button
          v-permission="['sys:dict:edit']"
          type="warning"
          :disabled="single"
          @click="handleEdit(selectedIds[0])"
        ><i-ep-edit />编辑</el-button
        >
        <el-button
          v-permission="['sys:dict:del']"
          type="danger"
          :disabled="multiple"
          @click="handleDel()"
        ><i-ep-delete />删除</el-button
        >
      </template>

      <el-table
        v-loading="loading"
        :data="list"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="50" />
        <el-table-column label="字典名称" prop="dictName" align="center" width="180" />
        <el-table-column label="字典键" prop="dictKey" align="center" width="180" />
        <el-table-column label="字典状态" prop="dictStatus" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.dictStatus === 'ENABLED'" type="success">启用</el-tag>
            <el-tag v-if="scope.row.dictStatus === 'DISABLED'" type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="left" min-width="200" />
        <el-table-column label="创建时间" prop="createTime" align="center" width="160" />
        <el-table-column label="操作" fixed="right" align="center" width="170">
          <template #default="scope">
            <el-button
              v-permission="['sys:dict:edit']"
              type="primary"
              size="small"
              link
              @click="showDictOptions(scope.row.id)"
            >字典数据</el-button
            >
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

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>

    <add-or-update ref="addOrUpdateRef" @submitted="handleQuery" />
    <option-list ref="optionListRef" />
  </div>
</template>

<script setup lang="ts">
import { listDict, delDict } from "@/api/sys/dict";
import { DictQuery, DictVO } from "@/api/sys/dict/types";
import AddOrUpdate from "./add-or-update.vue";
import OptionList from "./components/option-list.vue"

defineOptions({
  name: "SysDict",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm); // 查询表单
const addOrUpdateRef = ref();
const optionListRef = ref();

const list = ref<DictVO[]>([]); // 分页数据
const total = ref(0); // 数据总数
const loading = ref(false); //  加载状态
const selectedIds = ref<number[]>([]); // 选中ID集合 用于批量操作
const single = ref(true); // 单选禁用
const multiple = ref(true); // 多选禁用
const queryParams = reactive<DictQuery>({
  page: 1,
  pageSize: 10,
});
const dateTimeRange = ref("");

watch(dateTimeRange, (newVal) => {
  if (newVal) {
    queryParams.createBegin = newVal[0];
    queryParams.createEnd = newVal[1];
  }
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  listDict(queryParams)
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
  dateTimeRange.value = "";
  queryParams.page = 1;
  queryParams.createBegin = undefined;
  queryParams.createEnd = undefined;
  handleQuery();
}

/** 行选中 */
function handleSelectionChange(selection: any) {
  selectedIds.value = selection.map((item: any) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增 */
function handleAdd() {
  addOrUpdateRef.value.open();
}

/** 修改 */
function handleEdit(id: number) {
  addOrUpdateRef.value.open(id);
}

/** 修改 */
function showDictOptions(id: number) {
  optionListRef.value.open(id);
}

/** 删除 */
function handleDel(id?: number) {
  const ids: any = id || selectedIds.value;
  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }
  ElMessageBox.confirm("确认删除已选中的数据项？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    delDict(ids).then(() => {
      ElMessage.success("操作成功");
      resetQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>
