<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <dept-tree v-model="queryParams.deptId" @node-click="handleQuery" />
      </el-col>
      <el-col :span="20" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="queryParams.username"
                placeholder="用户名/昵称"
                clearable
                style="width: 160px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.userStatus"
                placeholder="全部"
                clearable
                class="!w-[100px]"
              >
                <el-option label="禁用" value="DISABLED" />
                <el-option label="启用" value="ENABLED" />
              </el-select>
            </el-form-item>

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

            <el-form-item>
              <el-button type="primary" @click="handleQuery"><i-ep-search />搜索</el-button>
              <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never" class="table-container">
          <template #header>
            <el-button v-permission="['sys:user:add']" type="success" @click="handleAdd"
            ><i-ep-plus />新增</el-button
            >
            <el-button
              v-permission="['sys:user:edit']"
              type="warning"
              :disabled="single"
              @click="handleEdit(selectedIds[0])"
            ><i-ep-edit />编辑</el-button
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
            <el-table-column label="编号" prop="id" key="id" align="center" width="60" />
            <el-table-column label="用户名" prop="username" align="center" width="120" />
            <el-table-column label="昵称" prop="nickname" align="center" width="120" />
            <el-table-column label="手机号码" prop="mobile" align="center" width="120" />
            <el-table-column label="邮箱" prop="email" align="center" width="180" />
            <el-table-column label="性别" prop="gender" align="center" width="80" :formatter="formatUserGender" />
            <el-table-column label="状态" prop="userStatus" align="center" width="80" :formatter="formatUserStatus" />
            <el-table-column label="部门" prop="deptName" align="center" width="120" />
            <el-table-column label="角色" prop="roleNames" align="left" min-width="150" show-overflow-tooltip />
            <el-table-column label="备注" prop="remark" align="left" min-width="150" />
            <el-table-column label="创建时间" prop="createTime" align="center" width="160" />
            <el-table-column label="操作" fixed="right" align="center" width="80">
              <template #default="scope">
                <el-button
                  v-permission="['sys:user:edit']"
                  type="primary"
                  size="small"
                  link
                  @click="handleEdit(scope.row.id)"
                >编辑</el-button
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
      </el-col>
    </el-row>
    <!-- 新增/修改 -->
    <add-or-update ref="addOrUpdateRef" @submitted="handleQuery" />
  </div>
</template>

<script setup lang="ts">
import { listUser } from "@/api/sys/user";
import { UserQuery, UserVO } from "@/api/sys/user/types";
import AddOrUpdate from "./add-or-update.vue";
import deptTree from "./components/dept-tree.vue";
import { getDictOptions, dictToTags } from "@/utils/dict";

defineOptions({
  name: "SysUser",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm); // 查询表单
const addOrUpdateRef = ref();

const list = ref<UserVO[]>([]); // 分页数据
const total = ref(0); // 数据总数
const loading = ref(false); //  加载状态
const selectedIds = ref<number[]>([]); // 选中ID集合 用于批量操作
const single = ref(true); // 单选禁用
const multiple = ref(true); // 多选禁用
const queryParams = reactive<UserQuery>({
  page: 1,
  pageSize: 10,
});
const dateTimeRange = ref("");
const userStatusOptions = ref<any[]>([]);
const userGenderOptions = ref<any[]>([]);

watch(dateTimeRange, (newVal) => {
  if (newVal) {
    queryParams.createBegin = newVal[0];
    queryParams.createEnd = newVal[1];
  }
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  listUser(queryParams)
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
  queryParams.deptId = undefined;
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
  nextTick(() => {
    addOrUpdateRef.value.open();
  });
}

/** 修改 */
function handleEdit(id: number) {
  nextTick(() => {
    addOrUpdateRef.value.open(id);
  });
}

function formatUserStatus(row: any, column: any) {
  return dictToTags(row[column.property], userStatusOptions.value);
}
function formatUserGender(row: any, column: any) {
  return dictToTags(row[column.property], userGenderOptions.value);
}

onMounted(() => {
  handleQuery();
  getDictOptions("sys_user_status")
    .then(({ data }) => {
      userStatusOptions.value = data;
    })
  getDictOptions("sys_user_gender")
    .then(({ data }) => {
      userGenderOptions.value = data;
    })
});
</script>
