<!-- 部门树 -->
<template>
  <el-card shadow="never">
    <el-input v-model="deptName" placeholder="部门名称" clearable>
      <template #prefix>
        <i-ep-search />
      </template>
    </el-input>

    <el-tree
      ref="deptTreeRef"
      class="mt-2"
      :data="deptTree"
      :props="{ children: 'children', label: 'deptName', disabled: '' }"
      :expand-on-click-node="false"
      :filter-node-method="handleFilter"
      default-expand-all
      @node-click="handleNodeClick"
    />
  </el-card>
</template>

<script setup lang="ts">
import { getDeptTree } from "@/api/sys/dept";
import { DeptTree } from "@/api/sys/dept/types";

const props = defineProps({
  modelValue: {
    type: [Number],
    default: undefined,
  },
});

const deptTree = ref<DeptTree[]>(); // 部门列表
const deptTreeRef = ref(ElTree); // 部门树
const deptName = ref(); // 部门名称

const emits = defineEmits(["node-click"]);

const deptId = useVModel(props, "modelValue", emits);

watchEffect(
  () => {
    deptTreeRef.value.filter(deptName.value);
  },
  {
    flush: "post", // watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
  }
);

/** 部门筛选 */
function handleFilter(value: string, data: any) {
  if (!value) {
    return true;
  }
  return data.deptName.indexOf(value) !== -1;
}

/** 部门树节点 Click */
function handleNodeClick(data: { [key: string]: any }) {
  deptId.value = data.id;
  emits("node-click");
}

onBeforeMount(() => {
  getDeptTree().then((response) => {
    deptTree.value = response.data;
  });
});
</script>
