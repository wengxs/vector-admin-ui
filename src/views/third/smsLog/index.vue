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
        <el-form-item label="短信平台" prop="platform">
          <el-input
            v-model="queryParams.platform"
            placeholder="短信平台"
            style="width: 160px"
            clearable
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="queryParams.mobile"
            placeholder="手机号码"
            style="width: 160px"
            clearable
          />
        </el-form-item>
        <el-form-item label="模版代码" prop="templateCode">
          <el-input
            v-model="queryParams.templateCode"
            placeholder="模版代码"
            style="width: 160px"
            clearable
          />
        </el-form-item>
        <el-form-item label="发送结果" prop="result">
          <el-select
            v-model="queryParams.result"
            placeholder="发送结果"
            style="width: 160px"
            clearable
          >
            <el-option label="成功" value="成功" />
            <el-option label="失败" value="失败" />
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
        <el-button
          v-permission="['third:smsLog:del']"
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
        <el-table-column label="短信平台" prop="platform" align="center" width="100" />
        <el-table-column label="手机号码" prop="mobile" align="center" width="120" />
        <el-table-column label="模版代码" prop="templateCode" align="center" width="140" />
        <el-table-column label="模版参数" prop="templateParam" align="center" width="180" show-overflow-tooltip />
        <el-table-column label="发送结果" prop="result" align="center" width="100" />
        <el-table-column label="异常信息" prop="exception" align="center" min-width="180" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" align="center" width="160" />
        <el-table-column label="操作" fixed="right" align="center" width="80">
          <template #default="scope">
            <el-button
              v-permission="['third:smsLog:del']"
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
  </div>
</template>

<script setup lang="ts">
import { listSmsLog, delSmsLog } from "@/api/third/smsLog";
import { SmsLogQuery, SmsLogVO } from "@/api/third/smsLog/types";

defineOptions({
  name: "ThirdSmsLog",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm); // 查询表单

const list = ref<SmsLogVO[]>([]); // 分页数据
const total = ref(0); // 数据总数
const loading = ref(false); //  加载状态
const selectedIds = ref<number[]>([]); // 选中ID集合 用于批量操作
const single = ref(true); // 单选禁用
const multiple = ref(true); // 多选禁用
const queryParams = reactive<SmsLogQuery>({
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
  listSmsLog(queryParams)
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
    delSmsLog(ids).then(() => {
      ElMessage.success("操作成功");
      resetQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>
