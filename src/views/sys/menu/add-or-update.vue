<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    @close="close"
    destroy-on-close
    :close-on-click-modal="false"
    draggable
    overflow
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="父级菜单" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          placeholder="选择上级菜单"
          :data="menuTree"
          filterable
          check-strictly
          :render-after-expand="false"
          :props="{ value: 'id', label: 'menuName' }"
        />
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="formData.type" @change="onMenuTypeChange">
          <el-radio value="MENU">菜单</el-radio>
          <el-radio value="BUTTON">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="formData.menuName" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="图标" prop="icon" v-if="formData.type == MenuTypeEnum.MENU">
        <icon-select v-model="formData.icon" />
      </el-form-item>
      <el-form-item label="路由路径" prop="path" v-if="formData.type == MenuTypeEnum.MENU">
        <el-input v-model="formData.path" placeholder="如：/sys/menu" />
      </el-form-item>
      <el-form-item label="页面路径" prop="component" v-if="formData.type == MenuTypeEnum.MENU">
        <el-input v-model="formData.component" placeholder="如：sys/menu/index">
          <template v-if="formData.type == MenuTypeEnum.MENU" #prepend>src/views/</template>
          <template v-if="formData.type == MenuTypeEnum.MENU" #append>.vue</template>
        </el-input>
      </el-form-item>
      <el-form-item label="权限标识" prop="permission" v-if="formData.type == MenuTypeEnum.BUTTON">
        <el-input v-model="formData.permission" placeholder="如：sys:menu:add" />
      </el-form-item>
      <el-form-item label="隐藏菜单" prop="type" v-if="formData.type == MenuTypeEnum.MENU">
        <el-radio-group v-model="formData.hidden">
          <el-radio :value="false">显示</el-radio>
          <el-radio :value="true">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="formData.sort"
          style="width: 100px"
          controls-position="right"
          :min="1"
        />
      </el-form-item>
      <el-form-item
        label="菜单按钮"
        prop="subPerms"
        v-if="formData.type == MenuTypeEnum.MENU && formData.id == undefined && formData.parentId"
      >
        <el-checkbox-group v-model="formData.subPermissions">
          <el-checkbox
            v-for="item in subPermsOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { getMenu, getMenuTree, addMenu, updateMenu } from "@/api/sys/menu";
import { MenuForm, MenuTreeVO } from "@/api/sys/menu/types";
import { MenuTypeEnum } from "@/enums/MenuTypeEnum";

defineComponent({
  name: "AddOrUpdate",
});
const props = defineProps({
  width: {
    type: String,
    default: "500",
  },
});
const emit = defineEmits(["submitted"]);

/** 表单 */
const formRef = ref(ElForm);
/** 窗口状态 */
const visible = ref(false);
/** 窗口标题 */
const title = ref<string>("新增");

/** 表单数据 */
const formData = reactive<MenuForm>({
  parentId: 0,
  sort: 1,
  type: MenuTypeEnum.MENU,
  hidden: false,
});

/** 校验规则 */
const rules = reactive({
  parentId: [{ required: true, message: "请选择顶级菜单", trigger: "blur" }],
  menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
  path: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
  // component: [{ required: true, message: "请输入组件路径", trigger: "blur" }]
});

const menuCacheData = reactive({
  type: "",
  path: "",
});

/** 菜单权限数据 */
const menuTree = ref<MenuTreeVO[]>([]);

const subPermsOptions = ref<OptionType[]>([
  { value: "QUERY", label: "查询" },
  { value: "ADD", label: "新增" },
  { value: "EDIT", label: "修改" },
  { value: "DEL", label: "删除" },
  { value: "EXPORT", label: "导出" },
  { value: "IMPORT", label: "导入" },
]);

/** 打开窗口 */
const open = (parentId?: number, id?: number) => {
  title.value = id ? "修改" : "新增";
  formData.parentId = parentId;
  getMenuTree()
    .then(({ data }) => {
      menuTree.value = [{ id: 0, menuName: "顶级菜单", children: data }];
    })
    .then(() => {
      visible.value = true;
      if (id) {
        getMenu(id).then(({ data }) => {
          Object.assign(formData, data);
          menuCacheData.type = data.type + "";
          menuCacheData.path = data.path ?? "";
        });
      }
    });
};

/** 关闭窗口 */
const close = () => {
  formRef.value.resetFields();
  formRef.value.clearValidate();
  Object.keys(formData).forEach((key) => {
    (formData as {[key: string]: any})[key] = undefined;
  });
  formData.parentId = 0;
  formData.sort = 1;
  formData.type = MenuTypeEnum.MENU;
  formData.hidden = false;
  formData.subPermissions = [];
  menuCacheData.type = "";
  menuCacheData.path = "";
};

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      if (formData.id) {
        updateMenu(formData).then(() => {
          ElMessage.success("操作成功");
          emit("submitted");
          visible.value = false;
        });
      } else {
        addMenu(formData).then(() => {
          ElMessage.success("操作成功");
          emit("submitted");
          visible.value = false;
        });
      }
    }
  });
}, 3000);

/** 菜单类型切换事件处理 */
const onMenuTypeChange = () => {
  // 如果菜单类型改变，清空路由路径；未改变在切换后还原路由路径
  if (formData.type !== menuCacheData.type) {
    formData.path = "";
  } else {
    formData.path = menuCacheData.path;
  }
};

/** 暴露方法 */
defineExpose({
  open,
});
</script>
