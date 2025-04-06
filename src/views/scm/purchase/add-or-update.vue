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
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="供应商名称" prop="supplierName">
            <el-autocomplete
              v-model="formData.supplierName"
              :fetch-suggestions="querySupplier"
              placeholder="供应商名称"
              @select="selectSupplier"
              :trigger-on-focus="false"
              value-key="supplierName"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商编号" prop="supplierId">
            <el-input v-model="formData.supplierId" placeholder="供应商编号" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="采购备注" prop="purchaseRemake">
        <el-input
          v-model="formData.purchaseRemake"
          placeholder="采购备注"
          :rows="2"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="采购明细">
        <el-button type="success" @click="handleAddRow"><i-ep-plus />新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-table :data="formData.details" border>
          <el-table-column type="index" align="center" width="30" />
          <el-table-column label="产品名称" prop="productName" align="left">
            <template #default="scope">
              <el-form-item
                :prop="`details.${scope.$index}.productName`"
                :rules="rules.productName"
              >
                <el-autocomplete
                  v-model="scope.row.productName"
                  :fetch-suggestions="
                    (queryString: string, callback: any) =>
                      queryProduct(queryString, callback, scope.$index)
                  "
                  placeholder="产品名称"
                  @select="(item: any) => selectProduct(item, scope.$index)"
                  :trigger-on-focus="false"
                  value-key="productName"
                  style="width: 100%"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="产品编号" prop="productId" align="center">
            <template #default="scope">
              <el-form-item :prop="`details.${scope.$index}.productId`" :rules="rules.productId">
                <el-input v-model="scope.row.productId" placeholder="产品编号" readonly />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购单价" prop="price" align="center">
            <template #default="scope">
              <el-form-item :prop="`details.${scope.$index}.price`" :rules="rules.price">
                <el-input v-model.number="scope.row.price" placeholder="采购单价" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" prop="qty" align="center">
            <template #default="scope">
              <el-form-item :prop="`details.${scope.$index}.qty`" :rules="rules.qty">
                <el-input v-model.number="scope.row.qty" placeholder="采购数量" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="60">
            <template #default="scope">
              <el-button type="primary" link size="small" @click="handleDelRow(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
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
import { getPurchase, addPurchase, updatePurchase } from "@/api/scm/purchase";
import { searchSupplier } from "@/api/scm/supplier";
import { searchProduct } from "@/api/pms/product";
import { PurchaseForm } from "@/api/scm/purchase/types";

defineComponent({
  name: "AddOrUpdate",
});
const props = defineProps({
  width: {
    type: String,
    default: "800",
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
const formData = reactive<PurchaseForm>({
  details: [],
});
/** 校验规则 */
const rules = reactive({
  supplierName: [{ required: true, message: "供应商不能为空", trigger: "blur" }],
  supplierId: [{ required: true, message: "供应商编号不能为空", trigger: "change" }],
  productName: [{ required: true, message: "产品名称不能为空", trigger: "blur" }],
  productId: [{ required: true, message: "产品编号不能为空", trigger: "change" }],
  qty: [
    {
      required: true,
      type: "number",
      message: "采购数量必须是数字且不能小于1",
      trigger: "blur",
      min: 1,
    },
  ],
  price: [
    {
      required: true,
      type: "number",
      message: "采购单价必须是数字且不能小于0",
      trigger: "blur",
      min: 0,
    },
  ],
});

/** 打开窗口 */
const open = (id?: number) => {
  title.value = id ? "修改" : "新增";
  visible.value = true;
  nextTick(() => {
    if (id) {
      getPurchase(id).then(({ data }) => {
        Object.assign(formData, { ...data });
      });
    } else {
      handleAddRow();
    }
  });
};

/** 关闭窗口 */
const close = () => {
  formRef.value.resetFields();
  formRef.value.clearValidate();
  Object.keys(formData).forEach((key: string) => {
    formData[key] = undefined;
  });
  formData.details = [];
};

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      if (formData.id) {
        updatePurchase(formData).then(() => {
          ElMessage.success("操作成功");
          emit("submitted");
          visible.value = false;
        });
      } else {
        addPurchase(formData).then(() => {
          ElMessage.success("操作成功");
          emit("submitted");
          visible.value = false;
        });
      }
    }
  });
}, 3000);

const querySupplier = (queryString: string, cb: (arg: any) => void) => {
  formData.supplierId = undefined;
  if (queryString) {
    searchSupplier(queryString).then(({ data }) => {
      cb(data);
    });
  }
};

const selectSupplier = (item: any) => {
  formData.supplierId = item.id;
  formData.supplierName = item.supplierName;
};

const queryProduct = (queryString: string, cb: (arg: any) => void, index: number) => {
  formData.details[index].productId = undefined;
  if (queryString) {
    searchProduct(queryString).then(({ data }) => {
      cb(data);
    });
  }
};

const selectProduct = (item: any, index: number) => {
  formData.details[index].productId = item.id;
  formData.details[index].productName = item.productName;
};

const handleAddRow = () => {
  formData.details.push({
    productId: undefined,
    productName: undefined,
    price: undefined,
    qty: undefined,
    amount: undefined,
  });
};

const handleDelRow = (index: number) => {
  formData.details.splice(index, 1);
};

/** 暴露方法 */
defineExpose({
  open,
});
</script>
