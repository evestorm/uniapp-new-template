<script>
export default {
  // 全局对象
  globalData: {
    appid: "wxe0c5639c8139419d",
    PicDomain: "https://pic.cwyyt.cn",
    canIUseGetUserInfo() {
      return uni.canIUse("button.open-type.getUserInfo"); // 判断小程序api是否能够在当前版本使用
    },
    canIUseGetUserProfile() {
      return uni.canIUse("getUserProfile"); // 判断小程序api是否能够在当前版本使用
    },
  }
}
</script>
<script setup>
import { useUserStore } from '@/store/modules/user';
import {
  onLaunch,
  onShow,
  onHide,
  } from "@dcloudio/uni-app";
const user = useUserStore();

// 及时更新微信小程序
const updateWxApp = () => {
  const updateManager = uni.getUpdateManager();
  updateManager.onCheckForUpdate(res => {
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      updateManager.onUpdateReady(async () => {
        let [, rdata] = await uni.showModal({
          title: "更新提示",
          content: "发现新版本，是否重启应用?",
          cancelColor: "#eeeeee",
          confirmColor: "#cf311e",
        });
        if (rdata.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        }
      });
    }
  });
  updateManager.onUpdateFailed(async () => {
    let [, rdata] = await uni.showModal({
      title: "提示",
      content: "检查到有新版本，但下载失败，请检查网络设置",
    });
    if (rdata.confirm) {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate();
    }
  });
}

onLaunch(() => {
  console.log('onLaunch');
  user.wxLogin();
  updateWxApp();
});
</script>

<style lang="scss">
/*每个页面公共css */

// 引入 iconfont 字体样式
@import "@/assets/iconfont/iconfont.css";

// 引入 自定义内置样式
@import "@/assets/css/main.scss";
</style>
