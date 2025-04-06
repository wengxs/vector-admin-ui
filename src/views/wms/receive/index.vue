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
        <el-form-item label="收货单号" prop="receiveNo">
          <el-input
            v-model="queryParams.receiveNo"
            placeholder="收货单号"
            style="width: 160px"
            clearable
          />
        </el-form-item>
        <el-form-item label="收货状态" prop="receiveStatus">
          <el-select
            v-model="queryParams.receiveStatus"
            placeholder="收货状态"
            style="width: 160px"
            clearable
          >
            <el-option
              v-for="item in receiveStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型" prop="bizType">
          <el-select
            v-model="queryParams.bizType"
            placeholder="业务类型"
            style="width: 160px"
            clearable
          >
            <el-option
              v-for="item in bizTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="业务单号" prop="bizNo">
          <el-input
            v-model="queryParams.bizNo"
            placeholder="业务单号"
            style="width: 160px"
            clearable
          />
        </el-form-item>
        <el-form-item label="物流名称" prop="logisticsName">
          <el-input
            v-model="queryParams.logisticsName"
            placeholder="物流名称"
            style="width: 160px"
            clearable
          />
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNo">
          <el-input
            v-model="queryParams.logisticsNo"
            placeholder="物流单号"
            style="width: 160px"
            clearable
          />
        </el-form-item>
        <el-form-item label="批次编号" prop="batchNo">
          <el-input
            v-model="queryParams.batchNo"
            placeholder="批次编号"
            style="width: 160px"
            clearable
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
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><i-ep-search />搜索</el-button>
          <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button v-permission="['wms:receive:add']" type="success" @click="handleAdd"
          ><i-ep-plus />新增</el-button
        >
        <el-button
          v-permission="['wms:receive:edit']"
          type="warning"
          :disabled="single"
          @click="handleEdit(selectedIds[0])"
          ><i-ep-edit />编辑</el-button
        >
        <el-button
          v-permission="['wms:receive:del']"
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
        <el-table-column label="收货单号" prop="receiveNo" align="center" width="150" />
        <el-table-column
          label="收货状态"
          prop="receiveStatus"
          align="center"
          width="100"
          :formatter="receiveStatusFormat"
        />
        <el-table-column
          label="业务类型"
          prop="bizType"
          align="center"
          width="100"
          :formatter="bizTypeFormat"
        />
        <el-table-column label="业务单号" prop="bizNo" align="center" width="150" />
        <el-table-column
          label="物流名称"
          prop="logisticsName"
          align="center"
          width="100"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="物流单号"
          prop="logisticsNo"
          align="center"
          width="140"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="签收时间" prop="signedTime" align="center" width="160" />
        <el-table-column label="批次编号" prop="batchNo" align="center" width="150" />
        <el-table-column label="创建时间" prop="createTime" align="center" width="160" />
        <el-table-column label="操作" fixed="right" align="center" width="100">
          <template #default="scope">
            <el-button
              v-permission="['wms:receive:edit']"
              type="primary"
              link
              size="small"
              @click="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              v-permission="['wms:receive:del']"
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
import { listReceive, delReceive } from "@/api/wms/receive";
import { getEnumByName } from "@/api/common";
import { ReceiveQuery, ReceiveVO } from "@/api/wms/receive/types";
import AddOrUpdate from "./add-or-update.vue";

defineOptions({
  name: "WmsReceive",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm); // 查询表单
const addOrUpdateRef = ref();

const list = ref<ReceiveVO[]>([]); // 分页数据
const total = ref(0); // 数据总数
const loading = ref(false); //  加载状态
const selectedIds = ref<number[]>([]); // 选中ID集合 用于批量操作
const single = ref(true); // 单选禁用
const multiple = ref(true); // 多选禁用
const queryParams = reactive<ReceiveQuery>({
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

const receiveStatusOptions = ref<OptionType[]>([]);
const receiveStatusFormat = (row: any) => {
  return receiveStatusOptions.value
    .filter((item: any) => item.value == row.receiveStatus)
    .map((item: any) => item.label)
    .toString();
};
const bizTypeOptions = ref<OptionType[]>([]);
const bizTypeFormat = (row: any) => {
  return bizTypeOptions.value
    .filter((item: any) => item.value == row.bizType)
    .map((item: any) => item.label)
    .toString();
};

/** 查询 */
function handleQuery() {
  loading.value = true;
  listReceive(queryParams)
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
    delReceive(ids).then(() => {
      ElMessage.success("操作成功");
      resetQuery();
    });
  });
}

onMounted(() => {
  getEnumByName("WmsReceiveStatus").then(({ data }) => {
    receiveStatusOptions.value = data;
  });
  getEnumByName("WmsBizType").then(({ data }) => {
    bizTypeOptions.value = data;
  });
  handleQuery();
});
</script>
