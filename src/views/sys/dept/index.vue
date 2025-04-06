<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="queryParams.deptName"
            placeholder="部门名称"
            style="width: 160px"
            clearable
          />
        </el-form-item>
        <el-form-item label="部门状态" prop="deptStatus">
          <el-select
            v-model="queryParams.deptStatus"
            placeholder="全部"
            clearable
            class="!w-[100px]"
          >
            <el-option label="禁用" value="DISABLED" />
            <el-option label="启用" value="ENABLED" />
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
        <el-button v-permission="['sys:dept:add']" type="success" @click="handleAdd(0)"
        ><i-ep-plus />新增</el-button
        >
      </template>

      <el-table
        v-loading="loading"
        :data="list"
        highlight-current-row
        border
        row-key="id"
        :tree-props="{
          children: 'children',
          hasChildren: 'hasChildren',
        }"
      >
        <el-table-column label="部门名称" prop="deptName" align="left" width="200" />
        <el-table-column label="部门领导" prop="leader" align="center" width="100" />
        <el-table-column label="联系电话" prop="phone" align="center" width="120" />
        <el-table-column label="邮箱" prop="email" align="center" width="180" />
        <el-table-column label="状态" align="center" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.deptStatus === 'ENABLED'" type="success">启用</el-tag>
            <el-tag v-if="scope.row.deptStatus === 'DISABLED'" type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" align="center" width="80" />
        <el-table-column label="备注" prop="remark" align="left" min-width="150" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" align="center" width="180" />

        <el-table-column label="操作" fixed="right" align="center" width="150">
          <template #default="scope">
            <el-button
              v-permission="['sys:dept:add']"
              type="primary"
              size="small"
              link
              @click.stop="handleAdd(scope.row.id)"
            >新增</el-button
            >
            <el-button
              v-permission="['sys:dept:edit']"
              type="primary"
              size="small"
              link
              @click.stop="handleEdit(scope.row.id)"
            >编辑</el-button
            >
            <el-button
              v-permission="['sys:dept:del']"
              type="primary"
              size="small"
              link
              @click.stop="handleDel(scope.row.id)"
            >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <add-or-update ref="addOrUpdateRef" @submitted="handleQuery" width="600" />
  </div>
</template>

<script setup lang="ts">
import { listDept, delDept } from "@/api/sys/dept";
import { DeptQuery, DeptVO } from "@/api/sys/dept/types";
import AddOrUpdate from "./add-or-update.vue";

defineOptions({
  name: "SysDept",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const addOrUpdateRef = ref();

const list = ref<DeptVO[]>([]); // 列表数据
const loading = ref(false); // 加载状态
const queryParams = reactive<DeptQuery>(<DeptQuery>{});

/** 查询 */
function handleQuery() {
  // 重置父组件
  loading.value = true;
  listDept(queryParams)
    .then(({ data }) => {
      list.value = data;
    })
    .then(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

/** 新增 */
function handleAdd(parentId: number) {
  addOrUpdateRef.value.open(parentId, undefined);
}

/** 修改 */
function handleEdit(id: number) {
  addOrUpdateRef.value.open(undefined, id);
}

/** 删除部门 */
function handleDel(id: number[]) {
  ElMessageBox.confirm("确认删除已选中的数据项？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    delDept(id).then(() => {
      ElMessage.success("操作成功");
      handleQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>
