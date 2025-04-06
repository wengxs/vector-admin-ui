<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="角色名称"
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
        <el-button v-permission="['sys:role:add']" type="success" @click="handleAdd()"
          ><i-ep-plus />新增</el-button
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
        <el-table-column label="角色名称" prop="roleName" align="center" width="150" />
        <el-table-column label="角色编码" prop="roleKey" align="center" width="150" />
        <el-table-column label="角色描述" prop="description" align="left" />
        <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
        <el-table-column label="操作" fixed="right" align="center" width="100">
          <template #default="scope">
            <el-button
              v-permission="['sys:role:edit']"
              type="primary"
              size="small"
              link
              @click="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              v-permission="['sys:role:del']"
              type="primary"
              size="small"
              link
              @click="handleDelete(scope.row.id)"
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
import { listRole, delRole } from "@/api/sys/role";
import { RoleQuery, RoleVO } from "@/api/sys/role/types";
import AddOrUpdate from "./add-or-update.vue";

defineOptions({
  name: "SysRole",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const addOrUpdateRef = ref();

const list = ref<RoleVO[]>([]); // 分页数据
const total = ref(0); // 数据总数
const loading = ref(false); //  加载状态
const selectedIds = ref<number[]>([]); // 选中ID集合 用于批量操作
const single = ref(true); // 单选禁用
const multiple = ref(true); // 多选禁用
const queryParams = reactive<RoleQuery>({
  page: 1,
  pageSize: 10,
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  listRole(queryParams)
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

/** 删除角色 */
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
    delRole(ids).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>
