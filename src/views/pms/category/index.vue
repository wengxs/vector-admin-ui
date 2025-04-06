<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input
            v-model="queryParams.categoryName"
            placeholder="分类名称"
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
        <el-button v-permission="['pms:category:add']" type="success" @click="handleAdd"
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
        <el-table-column label="分类名称" prop="categoryName" align="left" />
        <el-table-column label="图标" prop="icon" align="center" />
        <el-table-column label="展示状态" prop="displayed" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.displayed" type="success">展示</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="层级" prop="level" align="center" />
        <el-table-column label="排序" prop="sort" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" width="160" />
        <el-table-column label="操作" fixed="right" align="center" width="100">
          <template #default="scope">
            <el-button
              v-permission="['pms:category:edit']"
              type="primary"
              link
              size="small"
              @click="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              v-permission="['pms:category:del']"
              type="primary"
              link
              size="small"
              @click="handleDel(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 新增/修改 -->
    <add-or-update ref="addOrUpdateRef" @submitted="handleQuery" />
  </div>
</template>

<script setup lang="ts">
import { getCategoryTree, delCategory } from "@/api/pms/category";
import { CategoryQuery, CategoryVO } from "@/api/pms/category/types";
import AddOrUpdate from "./add-or-update.vue";

defineOptions({
  name: "PmsCategory",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm); // 查询表单
const addOrUpdateRef = ref();

const list = ref<CategoryVO[]>(); // 分页数据
const loading = ref(false); //  加载状态
const queryParams = reactive<CategoryQuery>({});

/** 查询 */
function handleQuery() {
  loading.value = true;
  getCategoryTree(queryParams)
    .then(({ data }) => {
      list.value = data;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
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
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    delCategory(ids).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>
