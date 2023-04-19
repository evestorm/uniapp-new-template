<template>
  <view v-if="appData.canIUseGetUserProfile()">
    <view class="header">
      <image src="https://placekitten.com/100/100"></image>
    </view>

    <view class="content">
      <view>首次进入需要授权才能使用哦</view>
      <text>获得你的公开信息(昵称，头像，手机号等)</text>
    </view>

    <view class="btn-wrapper">
      <button
        v-show="showGetUserProfileBtn"
        type="success"
        open-type="getUserProfile"
        @click="getUserInfoTap"
        >授权登录</button
      >
      <!-- <u-button v-show="showGetPhoneBtn" type="success" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">授权手机</u-button> -->
      <button @click="navigateBack" class="go-back">暂不登录</button>
    </view>
  </view>

  <view v-else>请升级微信版本</view>
</template>

<script setup>
import { useUserStore } from "@/store/modules/user";
import userApi from "@/api/user/loginService";
import { reactive, ref, getCurrentInstance } from 'vue';
import {
  onLoad,
  onShow,
  onHide,
  } from "@dcloudio/uni-app";

const user = useUserStore();
const instance = getCurrentInstance();

const mockUserInfo = {
  nickname: "Lance",
  sex: 1,
  avatar: "https://placekitten.com/100/100",
  city: "New York",
  phone: "",
};
const appData = reactive(getApp().globalData);
const showGetUserProfileBtn = ref(true); // 是否显示获取用户信息的按钮
const showGetPhoneBtn = ref(false); // 是否显示获取手机号的按钮
const redirectUrl = ref(""); // 最终跳转的url
const wxCode = ref(""); // uni.login 返回的 code

const getWxCode = async () => {
  const res = await uni.login({
    provider: "weixin",
  });
  if (res.code) {
    return res.code;
  }
  return "";
};

onLoad(async (options) => {
  let { redirectUrl: redirectURL } = options;
  redirectUrl.value = decodeURIComponent(redirectURL);
  wxCode.value = await getWxCode();
});

// 页面跳转
const jumpUrl = (url) => {
  console.log(url);
  if (
    url.indexOf("home/home") > -1 ||
    url.indexOf("message/message") > -1 ||
    url.indexOf("me/me") > -1
  ) {
    // getApp().globalData.indexQuery = {
    //   shareOpenid: this.$util.getQueryString(url, "shareOpenid"),
    // };
    uni.switchTab({
      url: url,
    });
  } else {
    // url解码
    uni.redirectTo({
      url: url,
    });
  }
};

// 暂不登录
const navigateBack = () => {
  this.jumpUrl(this.redirectUrl);
};

// 获取用户信息
const getUserInfoTap = async () => {
  const res = await uni.getUserProfile({
    desc: "注册身份信息验证",
  });
  console.log(res);
  if (res) {
    const userData = res;
    let postData = {
      iv: userData.iv,
      code: wxCode,
      raw_data: userData.rawData,
      signature: userData.signature,
      encrypted_data: userData.encryptedData,
    };
    console.log("uni.getUserProfile", userData);
    let [err, result] = await userApi.getUserInfo(postData);

    // TODO: 到时候删除
    result = {};
    result.userInfo = mockUserInfo;

    if (result) {
      // 登录成功
      user.setHasLogin(true);
      instance.appContext.config.globalProperties.$storage.setToken("mock token");
      user.setUserInfo(result.userInfo);
      uni.showToast({ title: "授权登陆成功" });
      setTimeout(() => {
        jumpUrl(redirectUrl.value);
      }, 500);
    } else {
      // 登录失败
      // 失败 or code 失效（重新获取code）
      wxCode.value = await user.getWxCode();
      uni.showModal({
        title: "授权失败",
        content: err,
        showCancel: false,
      });
    }
  } else {
    getWxCode();
    uni.showModal({
      title: "授权失败",
      content: "获取授权信息失败，请重新授权登录",
      showCancel: false,
    });
  }
};

// 获取手机号
const getPhoneNumber = (e) => {
  console.log(e);
  if (e.detail.encryptedData) {
    var data = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      // openId: getApp().globalData.userInfo.spOpenId
    };
    console.log(data);
    // 发送后端去解码手机号
    // let rdata=await GK01AppService.GetTelNum(data);
    // let updateUserDto = {
    // 	id: getApp().globalData.LoginUserId,
    // 	phone: rdata.phoneNumber
    // };
    // await getApp().globalData.UpdateUserInfo(updateUserDto);
    jumpUrl(redirectUrl.value);
  } else {
    uni.showModal({
      title: "未授权",
      content: "您未授权小程序获取您的手机号,请重新授权",
    });
  }
};
</script>

<style lang="scss" scoped>
@import "./auth";
</style>
