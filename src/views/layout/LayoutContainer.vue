<script setup></script>
<template>
  <main>
    <router-view></router-view>
  </main>
  <van-tabbar v-model="active" route>
    <van-tabbar-item to="/home" icon="notes-o">明细</van-tabbar-item>
    <van-tabbar-item icon="bar-chart-o" to="/data">统计</van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
  </van-tabbar>
</template>
<style scoped></style>
