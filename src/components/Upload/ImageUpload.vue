<template>
  <!-- 上传组件 -->
  <el-upload
    v-model="imgUrl"
    class="single-uploader"
    :show-file-list="false"
    list-type="picture-card"
    :before-upload="handleBeforeUpload"
    :http-request="upload"
  >
    <div v-if="imgUrl" class="single-uploader__image">
      <el-image :src="imgUrl" style="width: 150px; height: 150px; margin-top: 15px" fit="cover" />
    </div>
    <el-icon v-else class="single-uploader__icon"><i-ep-plus /></el-icon>
  </el-upload>
  <ImageCropper ref="imageCropperRef" />
</template>

<script setup lang="ts">
import { UploadRawFile, UploadRequestOptions } from "element-plus";
import { uploadFile } from "@/api/common";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  croppable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
const imgUrl = useVModel(props, "modelValue", emit);

const imageCropperRef = ref();

const tmpFile = ref<File>();

/**
 * 自定义图片上传
 *
 * @param options
 */
async function upload(options: UploadRequestOptions): Promise<any> {
  const { data } = await uploadFile(tmpFile.value ? tmpFile.value : options.file);
  imgUrl.value = data.url;
}

/**
 * 限制用户上传文件的格式和大小
 */
async function handleBeforeUpload(file: UploadRawFile) {
  if (props.croppable) {
    let canceled = false;
    await imageCropperRef.value
      .open(file)
      .then((newFile: UploadRawFile) => {
        tmpFile.value = newFile;
      })
      .catch(() => {
        canceled = true;
      });
    if (canceled) {
      return false;
    }
  }
  if (file.size > 2 * 1048 * 1048) {
    ElMessage.warning("上传图片不能大于2M");
    return false;
  }
  return true;
}
</script>

<style scoped lang="scss">
.single-uploader {
  overflow: hidden;
  cursor: pointer;
  border: 1px var(--el-border-color) solid;
  border-radius: 6px;

  &:hover {
    border-color: var(--el-color-primary);
  }

  &__image {
    display: block;
    width: 178px;
    height: 178px;
  }

  &___icon {
    width: 178px;
    height: 178px;
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
}
</style>
