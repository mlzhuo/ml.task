<template>
  <view>
    <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">OCR结果</block>
    </cu-custom>
    <view class="container">
      <view class="cu-list menu card-menu margin-bottom-xl shadow-lg">
        <view
          class="cu-item"
          v-for="(item, index) in ocrResultData"
          :key="index"
        >
          <view class="content">
            <text class="text-grey">{{ item }}</text>
          </view>
          <text
            class="cuIcon-copy text-grey copy-icon"
            @click="copyText(item)"
          ></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { CLEAR_OCR_RESULT } from "@/store/mutation-types";
export default {
  data() {
    return {
      ocrResultData: {}
    };
  },
  onShow() {
    this.renderResult();
  },
  methods: {
    renderResult() {
      const { ocrResult } = this.$store.state.tools;
      const { result } = ocrResult;
      delete result.errCode;
      delete result.errMsg;
      for (const key in result) {
        const v = result[key];
        if (typeof v === "object" && typeof v.length !== "number") {
          delete result[key];
        }
      }
      switch (result.ocrType) {
        case "printedText":
          const items = result.items.map(v => v.text);
          this.ocrResultData = items;
          break;
        default:
          this.ocrResultData = result;
          break;
      }
    },
    copyText(text) {
      wx.setClipboardData({ data: text });
    }
  },
  onUnload() {
    this.$store.commit(`tools/${CLEAR_OCR_RESULT}`);
    Object.assign(this.$data, this.$options.data());
  }
};
</script>

<style scoped>
.cu-list.card-menu {
  margin-left: 0;
  margin-right: 0;
}
</style>
