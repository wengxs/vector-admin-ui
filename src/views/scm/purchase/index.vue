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
        <el-form-item label="订单编号" prop="purchaseNo">
          <el-input
            v-model="queryParams.purchaseNo"
            placeholder="订单编号"
            style="width: 160px"
            clearable
          />
        </el-form-item>
        <el-form-item label="订单状态" prop="purchaseStatus">
          <el-select
            v-model="queryParams.purchaseStatus"
            placeholder="订单状态"
            clearable
            class="!w-[100px]"
          >
            <el-option
              v-for="item in purchaseStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input
            v-model="queryParams.supplierName"
            placeholder="供应商"
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
        <el-button v-permission="['scm:purchase:add']" type="success" @click="handleAdd"
          ><i-ep-plus />新增</el-button
        >
        <el-button
          v-permission="['scm:purchase:edit']"
          type="warning"
          :disabled="single"
          @click="handleEdit(selectedIds[0])"
          ><i-ep-edit />编辑</el-button
        >
        <el-button
          v-permission="['scm:purchase:cancel']"
          type="danger"
          :disabled="single"
          @click="handleCancel(selectedIds[0])"
          ><i-ep-delete />取消</el-button
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
        <el-table-column label="订单编号" prop="purchaseNo" align="center" width="150" />
        <el-table-column
          label="订单状态"
          prop="purchaseStatus"
          align="center"
          width="90"
          :formatter="purchaseStatusFormat"
        />
        <el-table-column
          label="供应商"
          prop="supplierName"
          align="center"
          width="140"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="采购备注"
          prop="purchaseRemake"
          width="140"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="订单金额" prop="amount" align="center" width="100" />
        <el-table-column label="创建时间" prop="createTime" align="center" width="160" />
        <el-table-column label="签约时间" prop="signedTime" align="center" width="160" />
        <el-table-column label="完结时间" prop="finishedTime" align="center" width="160" />
        <el-table-column label="取消时间" prop="canceledTime" align="center" width="160" />
        <el-table-column label="操作" fixed="right" align="center" width="160">
          <template #default="scope">
            <el-button
              v-permission="['scm:purchase:query']"
              type="primary"
              link
              size="small"
              @click="detailRef.open(scope.row.id)"
              >查看</el-button
            >
            <el-button
              v-permission="['scm:purchase:submit']"
              type="primary"
              link
              size="small"
              @click="handleSubmit(scope.row.id)"
              v-if="'DRAFT' === scope.row.purchaseStatus"
              >提交</el-button
            >
            <el-button
              v-permission="['scm:purchase:sign']"
              type="primary"
              link
              size="small"
              @click="handleSign(scope.row.id)"
              v-if="'SIGNING' === scope.row.purchaseStatus"
              >签约</el-button
            >
            <el-button
              v-permission="['scm:purchase:send']"
              type="primary"
              link
              size="small"
              @click="handleSend(scope.row.id)"
              v-if="'PURCHASING' === scope.row.purchaseStatus"
              >发货</el-button
            >
            <el-button
              v-permission="['scm:purchase:edit']"
              type="primary"
              link
              size="small"
              @click="handleEdit(scope.row.id)"
              v-if="canEditStatus.includes(scope.row.purchaseStatus)"
              >编辑</el-button
            >
            <el-button
              v-permission="['scm:purchase:cancel']"
              type="primary"
              link
              size="small"
              @click="handleCancel(scope.row.id)"
              v-if="canCancelStatus.includes(scope.row.purchaseStatus)"
              >取消</el-button
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
    <detail ref="detailRef" />
  </div>
</template>

<script setup lang="ts">
import {
  listPurchase,
  cancelPurchase,
  submitPurchase,
  signPurchase,
  sendPurchase,
} from "@/api/scm/purchase";
import { getEnumByName } from "@/api/common";
import { PurchaseQuery, PurchaseVO } from "@/api/scm/purchase/types";
import AddOrUpdate from "./add-or-update.vue";
import Detail from "@/views/scm/purchase/detail.vue";

defineOptions({
  name: "ScmPurchase",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm); // 查询表单
const addOrUpdateRef = ref();
const detailRef = ref();

const list = ref<PurchaseVO[]>([]); // 分页数据
const total = ref(0); // 数据总数
const loading = ref(false); //  加载状态
const selectedIds = ref<number[]>([]); // 选中ID集合 用于批量操作
const single = ref(true); // 单选禁用
const multiple = ref(true); // 多选禁用
const queryParams = reactive<PurchaseQuery>({
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

const purchaseStatusOptions = ref<OptionType[]>([]);
const purchaseStatusFormat = (row: any) => {
  return purchaseStatusOptions.value
    .filter((item: any) => item.value == row.purchaseStatus)
    .map((item: any) => item.label)
    .toString();
};
const canCancelStatus = ref<string[]>(["DRAFT", "APPROVING", "SIGNING", "REJECTED"]);
const canEditStatus = ref<string[]>(["DRAFT", "APPROVING", "SIGNING", "REJECTED"]);

/** 查询 */
function handleQuery() {
  loading.value = true;
  listPurchase(queryParams)
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

/** 取消 */
function handleCancel(id?: number) {
  const ids: any = id || selectedIds.value;
  if (!ids) {
    ElMessage.warning("请勾选取消项");
    return;
  }
  ElMessageBox.confirm("确认取消订单？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    cancelPurchase(ids).then(() => {
      ElMessage.success("操作成功");
      handleQuery();
    });
  });
}

const handleSubmit = (id: number) => {
  ElMessageBox.confirm("确认提交订单？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    submitPurchase(id).then(() => {
      ElMessage.success("操作成功");
      handleQuery();
    });
  });
};

const handleSign = (id: number) => {
  ElMessageBox.confirm("确认签约订单？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    signPurchase(id).then(() => {
      ElMessage.success("操作成功");
      handleQuery();
    });
  });
};

const handleSend = (id: number) => {
  ElMessageBox.confirm("确认订单发货？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    let data = {
      logisticsName: "XX物流",
      logisticsNo: Date.now(),
    };
    sendPurchase(id, data).then(() => {
      ElMessage.success("操作成功");
      handleQuery();
    });
  });
};

onMounted(() => {
  getEnumByName("ScmPurchaseStatus").then(({ data }) => {
    purchaseStatusOptions.value = data;
  });
  handleQuery();
});
</script>
