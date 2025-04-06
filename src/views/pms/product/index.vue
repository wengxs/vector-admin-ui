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
        <el-form-item label="产品名称" prop="productName">
          <el-input
            v-model="queryParams.productName"
            placeholder="产品名称"
            style="width: 160px"
            clearable
          />
        </el-form-item>
        <el-form-item label="生产厂家" prop="factory">
          <el-input
            v-model="queryParams.factory"
            placeholder="生产厂家"
            style="width: 160px"
            clearable
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
        <el-button v-permission="['pms:product:add']" type="success" @click="handleAdd()"
          ><i-ep-plus />新增</el-button
        >
        <el-button
          v-permission="['pms:product:edit']"
          type="warning"
          :disabled="single"
          @click="handleEdit(selectedIds[0])"
          ><i-ep-edit />编辑</el-button
        >
        <el-button
          v-permission="['pms:product:del']"
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
        <el-table-column label="产品名称" prop="productName" align="center" />
        <el-table-column label="生产厂家" prop="factory" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" width="160" />
        <el-table-column label="操作" fixed="right" align="center" width="100">
          <template #default="scope">
            <el-button
              v-permission="['pms:product:edit']"
              type="primary"
              link
              size="small"
              @click="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              v-permission="['pms:product:del']"
              type="primary"
              link
              size="small"
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
  </div>
</template>

<script setup lang="ts">
import { listProduct, delProduct } from "@/api/pms/product";
import { ProductQuery, ProductVO } from "@/api/pms/product/types";
import AddOrUpdate from "./add-or-update.vue";

defineOptions({
  name: "PmsProduct",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm); // 查询表单
const addOrUpdateRef = ref();

const list = ref<ProductVO[]>([]); // 分页数据
const total = ref(0); // 数据总数
const loading = ref(false); //  加载状态
const selectedIds = ref<number[]>([]); // 选中ID集合 用于批量操作
const single = ref(true); // 单选禁用
const multiple = ref(true); // 多选禁用
const queryParams = reactive<ProductQuery>({
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
  listProduct(queryParams)
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
    delProduct(ids).then(() => {
      ElMessage.success("操作成功");
      resetQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>
