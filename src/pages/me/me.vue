<template>
  <view class="content">
    <view>
      <!-- uni 组件 -->
      <uni-badge text="2" type="success" @click="bindClick"></uni-badge>
      <!-- iconfont 子图图标 -->
      <view class="icon iconfont icon-edit"></view>
    </view>
  </view>
</template>

<script setup>
const bindClick = () => {
  console.log('bindClick');
}
</script>

<style lang="scss" scoped>
@import "./me";
</style>
