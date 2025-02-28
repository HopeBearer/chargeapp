<script setup>
  import { useRouter } from 'vue-router'
  import { defineProps } from 'vue'
  const router = useRouter()
  // 父传子接收参数，父组件传递的title
  defineProps({
    title: {
      type: String,
      default: '标题'
    }
  })
</script>
<template>
  <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="router.go(-1)" />
</template>
<style scoped></style>
