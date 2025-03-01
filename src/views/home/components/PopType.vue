<script setup>
  import { getTypeListService } from '@/api/account'
  import { ref, onMounted } from 'vue'
  const state = ref({
    active: '全部类型',
    showButtom: false,
    expense: [],
    income: []
  })
  const toggle = () => {
    state.value.showButtom = !state.value.showButtom
  }
  defineExpose({
    toggle
  })

  onMounted(async () => {
    const {
      data: { list }
    } = await getTypeListService()
    state.value.expense = list.filter((item) => item.type === 1)
    state.value.income = list.filter((item) => item.type === 2)
  })

  const emit = defineEmits(['select'])

  const choseType = (item) => {
    state.value.active = item.id
    state.value.showButtom = false
    emit('select', item)
  }
</script>
<template>
  <van-popup
    v-model:show="state.showButtom"
    closeable
    close-icon-position="top-left"
    position="bottom"
    round
    :style="{ height: '70%' }"
  >
    <div class="pop">
      <div class="header van-hairline--bottom">
        请选择类型
        <van-icon name="cross" class="cross" @click="toggle" />
      </div>
      <div class="content">
        <div
          @click="choseType({ id: 'all' })"
          :class="{ all: true, active: state.active == '全部类型' }"
        >
          全部类型
        </div>
        <div class="title">支出</div>
        <div class="expense-wrap">
          <p
            @click="choseType(item)"
            :class="{ active: state.active == item.id }"
            v-for="item in state.expense"
            :key="item"
          >
            {{ item.name }}
          </p>
        </div>
        <div class="title">收入</div>
        <div class="income-wrap">
          <p
            @click="choseType(item)"
            :class="{ active: state.active == item.id }"
            v-for="item in state.income"
            :key="item"
          >
            {{ item.name }}
          </p>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<style lang="scss" scoped>
  .pop {
    position: relative;
    background-color: #f5f5f5;
    .header {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 1000;
      width: 100%;
      height: 56px;
      text-align: center;
      font-size: 14px;
      line-height: 56px;
      color: $color-text-base;
      background-color: #fff;
      .cross {
        position: absolute;
        left: 10px;
        top: 50%;
        font-size: 20px;
        transform: translateY(-50%);
        color: $color-text-secondary;
      }
    }
    .content {
      padding: 20px;
      .all {
        display: inline-block;
        padding: 12px 20px;
        font-size: 16px;
        color: $color-text-base;
        background-color: #fff;
      }
      .title {
        color: $color-text-caption;
        margin: 10px 0;
        font-size: 14px;
      }
      .expense-wrap,
      .income-wrap {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        p {
          width: calc((100% - 20px) / 3);
          text-align: center;
          padding: 12px 0;
          margin-bottom: 10px;
          background-color: #fff;
          font-size: 16px;
        }
      }
      .active {
        background-color: $primary !important;
        color: #fff;
      }
    }
  }
</style>
