<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    @close="close"
    :close-on-click-modal="false"
    draggable
    overflow
  >
    <el-form ref="formRef" :model="formData" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="采购单号" prop="purchaseNo">
            <el-input v-model="formData.purchaseNo" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购金额" prop="amount">
            <el-input v-model="formData.amount" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="formData.supplierName" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商编号" prop="supplierId">
            <el-input v-model="formData.supplierId" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="采购备注" prop="purchaseRemake">
        <el-input v-model="formData.purchaseRemake" :rows="2" type="textarea" readonly />
      </el-form-item>
      <el-form-item label="采购明细">
        <el-table :data="formData.details" border>
          <el-table-column type="index" align="center" width="30" />
          <el-table-column label="产品名称" prop="productName" align="left" />
          <el-table-column label="产品编号" prop="productId" align="center" />
          <el-table-column label="采购单价" prop="price" align="center" />
          <el-table-column label="采购数量" prop="qty" align="center" />
        </el-table>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { getPurchase } from "@/api/scm/purchase";
import { PurchaseVO } from "@/api/scm/purchase/types";

defineComponent({
  name: "Detail",
});
const props = defineProps({
  width: {
    type: String,
    default: "800",
  },
});

/** 表单 */
const formRef = ref(ElForm);
/** 窗口状态 */
const visible = ref(false);
/** 窗口标题 */
const title = ref<string>("详情");

/** 表单数据 */
const formData = reactive<PurchaseVO>({
  details: [],
});

/** 打开窗口 */
const open = (id: number) => {
  visible.value = true;
  nextTick(() => {
    getPurchase(id).then(({ data }) => {
      Object.assign(formData, { ...data });
    });
  });
};

/** 关闭窗口 */
const close = () => {
  Object.keys(formData).forEach((key: string) => {
    formData[key] = undefined;
  });
  formData.details = [];
};

/** 暴露方法 */
defineExpose({
  open,
});
</script>
