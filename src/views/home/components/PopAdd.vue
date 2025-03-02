<script setup>
  import { ref } from 'vue'

  const showAdd = ref(false)

  const toggle = () => {
    showAdd.value = !showAdd.value
  }

  defineExpose({
    toggle
  })
</script>
<template>
  <van-popup v-model:show="showAdd" position="bottom" round :style="{ height: '60%' }">
    <div class="add-wrap">
      <header class="header">
        <span class="close" @click="show = false">
          <van-icon name="cross" />
        </span>
        <van-button class="add-btn" type="primary" size="small"> 确定 </van-button>
      </header>
    </div>
  </van-popup>
</template>
<style lang="scss" scoped>
  .add-wrap {
    padding-top: 12px;
    .header {
      display: flex;
      justify-content: space-between;
      padding: 0 24px;
      .van-icon-cross {
        font-size: 20px;
        color: $color-text-secondary;
      }
      .close {
        display: flex;
        align-items: center;
      }
      .add-btn {
        padding: 0 12px;
        background-color: $primary;
        border-color: $primary;
      }
    }
  }
</style>
