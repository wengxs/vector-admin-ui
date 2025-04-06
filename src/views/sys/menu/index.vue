<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="queryParams.menuName"
            placeholder="菜单名称"
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
        <el-button v-permission="['sys:menu:add']" type="success" @click="handleAdd(0)"
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
        <el-table-column label="菜单名称" width="200">
          <template #default="scope">
            <el-icon v-if="scope.row.icon && scope.row.icon.startsWith('el-icon')">
              <component :is="scope.row.icon.replace('el-icon-', '')" />
            </el-icon>
            <svg-icon v-else-if="scope.row.icon" :icon-class="scope.row.icon" />
            {{ scope.row.menuName }}
          </template>
        </el-table-column>

        <el-table-column label="类型" align="center" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.type === MenuTypeEnum.MENU" type="success">菜单</el-tag>
            <el-tag v-if="scope.row.type === MenuTypeEnum.BUTTON">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="路由路径" prop="path" align="left" width="150" />
        <el-table-column label="组件路径" prop="component" align="left" width="180" />
        <el-table-column label="权限标识" prop="permission" align="left" width="180" />
        <el-table-column label="排序" prop="sort" align="center" width="80" />
        <el-table-column label="创建时间" prop="createTime" align="center" width="180" />

        <el-table-column label="操作" fixed="right" align="center" width="150">
          <template #default="scope">
            <el-button
              v-if="scope.row.type == 'MENU'"
              v-permission="['sys:menu:add']"
              type="primary"
              size="small"
              link
              @click.stop="handleAdd(scope.row.id)"
              >新增</el-button
            >
            <el-button
              v-permission="['sys:menu:edit']"
              type="primary"
              size="small"
              link
              @click.stop="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              v-permission="['sys:menu:del']"
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
import { listMenu, delMenu } from "@/api/sys/menu";
import { MenuQuery, MenuVO } from "@/api/sys/menu/types";
import { MenuTypeEnum } from "@/enums/MenuTypeEnum";
import AddOrUpdate from "./add-or-update.vue";

defineOptions({
  name: "SysMenu",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const addOrUpdateRef = ref();

const list = ref<MenuVO[]>([]); // 列表数据
const loading = ref(false); // 加载状态
const queryParams = reactive<MenuQuery>({});

/** 查询 */
function handleQuery() {
  // 重置父组件
  loading.value = true;
  listMenu(queryParams)
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

/** 删除菜单 */
function handleDel(id: number) {
  ElMessageBox.confirm("确认删除已选中的数据项？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    delMenu(id).then(() => {
      ElMessage.success("操作成功");
      handleQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>
