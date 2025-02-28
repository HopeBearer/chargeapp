<script setup></script>
<template>
  <div class="home">
    <div class="header">
      <div class="type-wrap">
        <span class="title">全部类型</span>
        <i class="iconfont icon-type" />
      </div>
      <div class="data-wrap">
        <span class="time"> 2020-12 <i class="iconfont icon-icon_sort_down" /></span>
        <span class="expense">总支出 ¥1000.00</span>
        <span class="income">总收入 ¥2000.00</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .home {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 80px;
    .header {
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 80px;
      background-color: #39be77;
      color: #fff;
      font-size: 14px;
      padding: 20px 20px;
      z-index: 100;
      .type-wrap {
        background-color: #50ca84;
        display: inline-block;
        padding: 6px;
        border-radius: 4px;
        position: relative;
        align-self: baseline;
        .title {
          margin-right: 22px;
        }
        .title::after {
          content: '';
          position: absolute;
          top: 12px;
          bottom: 11px;
          right: 32px;
          width: 1px;
          background-color: #e9e9e9;
        }
      }
      .data-wrap {
        margin-top: 10px;
        font-size: 13px;
        .time {
          margin-right: 12px;
          .sort-down {
            font-size: 12px;
          }
        }
        .expense {
          margin-right: 10px;
        }
      }
    }
  }
</style>
