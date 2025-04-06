<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="532"
    @close="close"
    :close-on-click-modal="false"
    draggable
    overflow
    append-to-body
    center
  >
    <div class="cropper">
      <vueCropper
        ref="cropperRef"
        :img="option.img"
        :output-size="option.outputSize"
        :output-type="option.outputType"
        :info="option.info"
        :can-scale="option.canScale"
        :auto-crop="option.autoCrop"
        :auto-crop-width="option.autoCropWidth"
        :auto-crop-height="option.autoCropHeight"
        :fixed="option.fixed"
        :fixed-number="option.fixedNumber"
        :full="option.full"
        :fixed-box="option.fixedBox"
        :can-move="option.canMove"
        :can-move-box="option.canMoveBox"
        :original="option.original"
        :center-box="option.centerBox"
        :high="option.high"
        :info-true="option.infoTrue"
        :max-img-size="option.maxImgSize"
        :enlarge="option.enlarge"
        :mode="option.mode"
        :limit-min-size="option.limitMinSize"
        :fill-color="option.fillColor"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button :icon="RefreshLeft" circle @click="handleRotate('left')" />
        <el-button :icon="Check" type="primary" circle @click="handleSubmit" />
        <el-button :icon="Close" type="danger" circle @click="visible = false" />
        <el-button :icon="RefreshRight" circle @click="handleRotate('right')" />
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import { RefreshRight, RefreshLeft, Check, Close } from "@element-plus/icons-vue";

/** 表单 */
const cropperRef = ref();
/** 窗口状态 */
const visible = ref(false);
/** 窗口标题 */
const title = ref<string>("图片裁剪");

/** 裁剪器属性 */
const option = reactive({
  img: "", // 裁剪图片的地址[url地址, base64, blob]
  outputSize: 1, // 裁剪生成图片的质量[0.1 ~ 1]
  outputType: "jpeg", // 裁剪生成图片的格式[jpeg, png, webp]
  info: true, // 裁剪框的大小信息[true, false]
  canScale: false, // 图片是否允许滚轮缩放[true, false]
  autoCrop: true, // 是否默认生成截图框[true, false]
  autoCropWidth: "1000", // 默认生成截图框宽度 容器的80%[0 ~ max]
  autoCropHeight: "1000", // 默认生成截图框高度 容器的80%[0 ~ max]
  fixed: true, // 是否开启截图框宽高固定比例[true, false]
  fixedNumber: [1, 1], // 截图框的宽高比例,开启fixed生效[宽度, 高度]
  full: false, // 是否输出原图比例的截图[true, false]
  fixedBox: false, // 固定截图框大小[false]
  canMove: false, // 上传图片是否可以移动[true, false]
  canMoveBox: true, // 截图框能否拖动[true, false]
  original: false, // 上传图片按照原始比例渲染[true, false]
  centerBox: true, // 截图框是否被限制在图片里面[true, false]
  high: true, // 是否按照设备的dpr 输出等比例图片[true, false]
  infoTrue: true, // 为展示真实输出图片宽高 false 展示看到的截图框宽高 false[true, false]
  maxImgSize: 2000, // 限制图片最大宽度和高度[0 ~ max]
  enlarge: 1, // 图片根据截图框输出比例倍数[0 ~ max](建议不要太大不然会卡死的呢)
  mode: "contain", // 图片默认渲染方式[contain, cover, 100px, 100% auto]
  limitMinSize: 100, // 裁剪框限制最小区域[Number, Array, String]
  fillColor: "", // 导出时背景颜色填充[#ffffff, white]
});

const image = ref<File>();

const resolveRef = ref();
const rejectRef = ref();

/** 打开窗口 */
const open = (img: any) => {
  return new Promise((resolve, reject) => {
    visible.value = true;
    image.value = img;
    option.img = URL.createObjectURL(img);
    resolveRef.value = resolve;
    rejectRef.value = reject;
  });
};

/** 关闭窗口 */
const close = () => {
  option.img = "";
  cropperRef.value.clearCrop();
  rejectRef.value();
};

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  cropperRef.value.getCropBlob((data: Blob) => {
    const fileName = image.value ? image.value.name : "tmp.jpg";
    const file = new File([data], fileName);
    resolveRef.value(file);
    visible.value = false;
  });
}, 3000);

const handleRotate = (direction: string) => {
  if (direction === "left") {
    cropperRef.value.rotateLeft();
  } else {
    cropperRef.value.rotateRight();
  }
};

/** 暴露方法 */
defineExpose({
  open,
});
</script>

<style scoped lang="scss">
.cropper {
  width: 500px;
  height: 500px;
}
</style>
