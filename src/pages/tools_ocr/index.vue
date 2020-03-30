<template>
  <view>
    <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">OCR</block>
    </cu-custom>
    <view class="container">
      <view class="grid margin-bottom text-center col-2">
        <view
          class="padding grid-item"
          v-for="(item, index) in list"
          :key="index"
        >
          <view class="inner-item" @click="ocrAction(index)">
            <text class="icon" :class="item.icon" style="font-size:30px"></text>
            <text class="text">{{ item.title }}</text>
          </view>
        </view>
      </view>
    </view>
    <Loading v-if="isShowLoading"></Loading>
    <view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
import { STORE_OCR_RESULT } from "@/store/mutation-types";
export default {
  data() {
    return {
      isShowLoading: false,
      list: [
        {
          title: "银行卡",
          icon: "cuIcon-vipcard"
        },
        {
          title: "营业执照",
          icon: "cuIcon-form"
        },
        {
          title: "身份证",
          icon: "cuIcon-profile"
        },
        {
          title: "文本",
          icon: "cuIcon-font"
        },
        {
          title: "驾驶证",
          icon: "cuIcon-deliver"
        },
        {
          title: "行驶证",
          icon: "cuIcon-deliver"
        }
      ]
    };
  },
  onShow() {},
  mounted() {},
  methods: {
    async ocrAction(index) {
      const chooseImageRes = await wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"]
      });
      const tempFilePath = chooseImageRes.tempFilePaths[0];
      this.isShowLoading = true
      const uploadFileRes = await wx.cloud.uploadFile({
        cloudPath: `ocrPicTemp/${tempFilePath.split("://")[1]}`,
        filePath: tempFilePath
      });
      this.getImgUrl(uploadFileRes.fileID, index);
    },
    async getImgUrl(url, index) {
      const getTempFileURLRes = await wx.cloud.getTempFileURL({
        fileList: [url]
      });
      const { fileID, tempFileURL } = getTempFileURLRes.fileList[0];
      this.startOcr(index, tempFileURL, fileID);
    },
    startOcr(index, imgUrl, fileID) {
      const that = this;
      let name = "";
      switch (index) {
        case 0:
          name = "ocrBankcard";
          break;
        case 1:
          name = "ocrBusinessLicense";
          break;
        case 2:
          name = "ocrIdcard";
          break;
        case 3:
          name = "ocrPrintedText";
          break;
        case 4:
          name = "ocrDriverLicense";
          break;
        case 5:
          name = "ocrVehicleLicense";
          break;
        default:
          break;
      }
      wx.cloud.callFunction({
        name,
        data: {
          imgUrl
        },
        success: res => {
          console.log(res);
          that.ocrSuccess(res, fileID);
        }
      });
    },
    ocrSuccess(ocrResult, fileID) {
      this.isShowLoading = false
      this.$store.commit(`tools/${STORE_OCR_RESULT}`, ocrResult);
      wx.navigateTo({
        url: "/pages/tools_ocr_result/main"
      });
      wx.cloud.deleteFile({
        fileList: [fileID]
      });
    }
  }
};
</script>

<style scoped>
.grid-item {
  height: 120px;
  position: relative;
  border-right: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
}
.inner-item {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
}
.grid-item:nth-child(2n + 1) {
  border-left: 1px solid #efefef;
}
.grid-item:nth-child(1),
.grid-item:nth-child(2) {
  border-top: 1px solid #efefef;
}
.icon {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.text {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
