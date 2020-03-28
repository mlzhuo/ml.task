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
          <view class="inner-item" v-if="index === 0" @click="ocrText">
            <text class="icon" :class="item.icon" style="font-size:30px"></text>
            <text class="text">{{ item.title }}</text>
          </view>
          <ocr-navigator
            :certificateType="item.type"
            :opposite="false"
            @success="ocrSuccess"
            v-else
          >
            <view class="inner-item">
              <text
                class="icon"
                :class="item.icon"
                style="font-size:30px"
              ></text>
              <text class="text">{{ item.title }}</text>
            </view>
          </ocr-navigator>
        </view>
      </view>
    </view>
    <view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          index: 0,
          title: "文本",
          icon: "cuIcon-font"
        },
        {
          index: 1,
          title: "身份证",
          icon: "cuIcon-profile",
          type: "idCard"
        },
        {
          index: 2,
          title: "银行卡",
          icon: "cuIcon-vipcard",
          type: "bankCard"
        },
        {
          index: 3,
          title: "驾驶证",
          icon: "cuIcon-deliver",
          type: "drivingLicense"
        },
        {
          index: 4,
          title: "营业执照",
          icon: "cuIcon-form",
          type: "businessLicense"
        }
      ]
    };
  },
  onShow() {},
  mounted() {},
  methods: {
    itemClick(index) {},
    ocrSuccess(e) {
      console.log(e);
    },
    ocrText() {
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths);
          wx.cloud.callFunction({
            name: "ocrPrintedText",
            data: {
              imgUrl: tempFilePaths
            },
            complete: console.log()
          });
        }
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
