<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :disabled="disabled"
    clearable
    @change="handleChange"
  >
    <el-option
      v-for="option in options"
      :key="option.optionValue"
      :label="option.optionLabel"
      :value="option.optionValue"
    />
  </el-select>
</template>

<script setup lang="ts">
import { listDictOption } from "@/api/sys/dict";
import { DictOptionVO } from "@/api/sys/dict/types";

const props = defineProps({
  /**
   * 字典类型编码(eg: 性别-gender)
   */
  dictKey: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number],
  },
  placeholder: {
    type: String,
    default: "请选择",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:modelValue"]); // 父组件监听事件，同步子组件值的变化给父组件

const options: Ref<DictOptionVO[]> = ref([]); // 字典下拉数据源

const selectedValue = ref<string | number | undefined>();

watch([options, () => props.modelValue], ([newOptions, newModelValue]) => {
  if (newOptions.length === 0) return; // 下拉数据源加载未完成不回显
  if (newModelValue == undefined) {
    selectedValue.value = undefined;
    return;
  }
  if (typeof newOptions[0].optionValue === "number") {
    selectedValue.value = Number(newModelValue);
  } else if (typeof newOptions[0].optionValue === "string") {
    selectedValue.value = String(newModelValue);
  } else {
    selectedValue.value = newModelValue;
  }
});

function handleChange(val?: string | number | undefined) {
  emits("update:modelValue", val);
}

onBeforeMount(() => {
  // 根据字典类型编码(typeCode)获取字典选项
  listDictOption(props.dictKey).then((response) => {
    options.value = response.data;
  });
});
</script>
