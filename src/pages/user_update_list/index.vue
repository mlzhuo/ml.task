<template>
  <view>
    <cu-custom bgcolor="bg-gradual-orange" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">更新日志</block>
    </cu-custom>
    <view class="cu-list menu sm-border card-menu margin-top">
      <view
        v-for="item in versions"
        :key="item.version"
        class="cu-item arrow"
        @tap="showCurrentModal(item)"
      >
        <view class="content" hover-class="none">
          <text class="cuIcon-tagfill text-green"></text>
          <text class="text-grey">{{item.version}} 更新日志</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{item.date}}</text>
        </view>
      </view>
    </view>
    <view class="cu-tabbar-height"></view>
    <view class="cu-modal" :class="isShowModal?'show':''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{currentVersion.version}} 更新日志</view>
          <view class="action" @tap="isShowModal = false">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl">
          更新日期：{{currentVersion.date}}
          <br />
          <view
            :class="{'padding-l-5em': index > 0}"
            v-for="(item, index) in updateInfo"
            :key="index"
          >{{index===0 ? '更新日志：1. ' + item : index + 1 + '. ' + item}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { formatVersionText } from "@/utils";
export default {
  data() {
    return {
      versions: [],
      currentVersion: {},
      updateInfo: [],
      isShowModal: false
    };
  },
  onShow() {
    this.versions = this.$store.state.miniapp.versions;
  },
  mounted() {},
  methods: {
    showCurrentModal(version) {
      this.currentVersion = version;
      this.updateInfo = formatVersionText(this.currentVersion.description);
      this.isShowModal = true;
    }
  }
};
</script>
<style scoped>
.padding-xl {
  text-align: left;
}
.padding-l-5em {
  padding-left: 5em;
}
</style>