import { listDictOption } from "@/api/sys/dict";
import { h } from "vue";
import { ElTag } from "element-plus";

export function getDictOptions(dictKey: string) {
  return listDictOption(dictKey);
}
export function dictToTags(value: string, dictOptions: any[]) {
  let vn = h('span', {}, value);
  for (let dictOption of dictOptions) {
    if (dictOption.optionValue === value) {
      if (dictOption.style) {
        vn = h(ElTag, {
          type: dictOption.style
        }, () => dictOption.optionLabel)
      } else {
        vn = h('span', {}, dictOption.optionLabel);
      }
      break;
    }
  }
  return vn;
}
