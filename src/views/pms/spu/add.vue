<template>
  <div class="app-container">
    <el-card shadow="never" class="table-container">
      <template #header>
        <el-text tag="b" size="large">基础信息</el-text>
      </template>
      <el-form label-position="top" label-width="auto" :model="formData">
        <el-form-item label="商品标题" prop="title">
          <el-input v-model="formData.spuName" />
        </el-form-item>
        <el-form-item label="商品图片" prop="avatar">
          <span v-for="index in 5" :key="index" style="margin-right: 10px">
            <image-upload v-model="formData.images[index - 1]" croppable />
          </span>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="table-container" style="margin-top: 10px">
      <template #header>
        <el-text tag="b" size="large">商品规格</el-text>
        &nbsp;&nbsp;
        <el-button size="small" @click="addAttr">添加规格</el-button>
      </template>
      <el-form label-width="auto" :model="formData">
        <div
          v-for="(item, index) in formData.specs"
          :key="index"
          style="background-color: #fafafa; padding: 10px 0 1px 0; margin-bottom: 10px"
        >
          <el-form-item
            label="规格名"
            :prop="'specs.' + index + '.attr'"
            :rules="[{ required: true, message: '规格名不能为空！', trigger: 'blur' }]"
          >
            <el-input v-model="item.attr" placeholder="规格名" style="width: 120px" />
            <el-button :icon="Delete" link @click="() => formData.specs.splice(index, 1)" />
          </el-form-item>
          <el-form-item label="规格值">
            <span v-for="(value, index) in item.values" :key="index">
              <el-input
                v-model="item.values[index]"
                :placeholder="`${item.attr}值`"
                style="width: 120px"
              />
              <el-button :icon="Delete" link @click="() => item.values.splice(index, 1)" />
              &nbsp;&nbsp;
            </span>
            <el-button :icon="CirclePlus" link @click="addAttrVal(index)" />
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <el-card shadow="never" class="table-container" style="margin-top: 10px">
      <template #header>
        <el-text tag="b" size="large">价格和库存</el-text>
      </template>
      <el-table :data="skuList" border>
        <el-table-column v-for="(item, index) in formData.specs" :label="item.attr" :key="index">
          <template #default="{ row, column }">
            <span>{{ row[column.label] }}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in tableHeader" :label="item.label" :key="index">
          <template #default="{ $index }">
            <el-input-number
              v-if="item.label === '价格'"
              v-model="skuList[$index][item.key]"
              :precision="2"
              size="small"
            />
            <el-input-number v-else v-model="skuList[$index][item.key]" size="small" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card shadow="never" class="table-container" style="margin-top: 10px">
      <el-button type="primary" @click="handleSave">保存</el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { addSpu } from "@/api/pms/spu";
import { CirclePlus, Delete } from "@element-plus/icons-vue";
import { SpuAddForm } from "@/api/pms/spu/types";

defineOptions({
  name: "PmsSpuAdd",
  inheritAttrs: false,
});

const formData = ref<SpuAddForm>({
  categoryId: 0,
  spuName: "",
  images: [],
  description: "",
  skus: [],
  specs: [],
});

const skuList = ref([]);

const tableHeader = [
  { label: "价格", key: "price" },
  { label: "库存", key: "stock" },
];

watch(formData.value.specs, (value) => {
  genSku(value);
});

const genSku = (specs) => {
  let temp = [];
  specs.forEach((item, index) => {
    if (!temp.length) {
      temp.push(
        ...item.values.map((t) => {
          const oldValue = skuList.value.find((v) => v.sku === t);
          if (oldValue) {
            return { ...oldValue };
          } else {
            return {
              [`skuName${index + 1}`]: item.attr,
              [`skuValue${index + 1}`]: t,
              [item.attr]: t,
              price: 0,
              stock: 0,
              sku: t,
            };
          }
        })
      );
    } else {
      const array = [];
      temp.forEach((obj) => {
        if (item.values.length === 0) {
          array.push(obj);
        }
        array.push(
          ...item.values.map((t) => {
            if (obj.sku) {
              obj.sku = obj.sku + t; //唯一值
            }
            const oldValue = skuList.value.find((item) => item.sku === obj.sku);
            if (oldValue) {
              return { ...oldValue }; // 必须展开否则会变成 proxy对象
            } else {
              return {
                ...obj,
                [`skuName${index + 1}`]: item.attr,
                [`skuValue${index + 1}`]: t,
                [item.attr]: t,
                price: 0,
                stock: 0,
              };
            }
          })
        );
      });
      temp = array;
    }
  });
  skuList.value = temp.map((item, index) => {
    let specLength = specs.length;
    const attrs = [];
    for (let i = 0; i < specLength; i++) {
      attrs.push({
        name: item[`skuName${i + 1}`],
        value: item[`skuValue${i + 1}`],
      });
    }
    item.attrs = attrs;
    return item;
  });
};

const addAttr = () => {
  formData.value.specs.push({
    attr: "",
    values: [""],
  });
};

const addAttrVal = (index: number) => {
  formData.value.specs[index].values.push("");
};

const handleSave = () => {
  formData.value.skus = skuList.value;
  addSpu(formData.value).then(() => {
    ElMessage.success("操作成功");
  });
};
</script>
