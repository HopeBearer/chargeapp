<script setup>
  import { ref } from 'vue'
  import PopType from './components/PopType.vue'
  import PopMonth from './components/PopMonth.vue'
  import CardItem from './components/CardItem.vue'
  import { getBillListService } from '@/api/account.js'
  import dayjs from 'dayjs'
  import PopAdd from './components/PopAdd.vue'
  const popTypeRef = ref(null)

  // 账单对象
  const bill = ref({
    // 账单列表
    list: [],
    // 总页数
    totalPage: 0,
    // 当前选择的类型
    currentSelect: {},
    // 当前选择的月份
    curTime: dayjs([new Date().getFullYear(), new Date().getMonth() + 1]).format('YYYY-MM'),
    page: 1,
    page_size: 5,
    totalExpense: 0,
    totalIncome: 0
  })
  // 刷新状态
  const refreshing = ref(false)
  // 数据加载完成状态
  const finished = ref(false)
  // 加载状态
  const loading = ref(false)
  // 当前选中的类型
  const showPopButtom = () => {
    popTypeRef.value.toggle()
  }
  // click 选择类型
  const selectType = (item) => {
    bill.value.currentSelect = item
    getBillList()
  }
  // 时间组件对象
  const popMonthRef = ref(null)
  // 时间弹窗
  const popMonthToggle = () => {
    popMonthRef.value.toggle()
  }
  const selectMonth = (curDateStr) => {
    // 格式 yyyy年mm月
    bill.value.curTime = curDateStr
    getBillList()
  }

  // 获取账单列表
  const getBillList = async () => {
    const res = await getBillListService({
      date: bill.value.curTime,
      type: bill.value.currentSelect.id || 'all',
      page: bill.value.page,
      page_size: bill.value.page_size
    })
    if (refreshing.value) {
      bill.value.list = []
      refreshing.value = false
    }
    loading.value = false
    bill.value.list = bill.value.list.concat(res.data.list)
    bill.value.totalPage = res.data.total_page
    bill.value.totalExpense = res.data.totalExpense.toFixed(2)
    bill.value.totalIncome = res.data.totalIncome.toFixed(2)
    if (bill.value.page >= bill.value.totalPage) {
      finished.value = true
    }
  }
  getBillList()
  const onLoad = () => {
    if (!refreshing.value && bill.value.page < bill.value.totalPage) {
      bill.value.page += 1
    }
    getBillList()
  }
  const onRefresh = () => {
    finished.value = false
    bill.value.page = 1
    refreshing.value = true
    loading.value = true
    onLoad()
  }

  // 添加账单组件对象
  const popAddRef = ref(null)

  const popAddToggle = () => {
    popAddRef.value.toggle()
  }
</script>

<template>
  <div class="home">
    <div class="header">
      <div class="type-wrap" @click="showPopButtom">
        <span class="title">{{ bill.currentSelect.name || '全部类型' }}</span>
        <i class="iconfont icon-type" />
      </div>
      <div class="data-wrap">
        <span class="time" @click="popMonthToggle">
          {{ bill.curTime }} <i class="iconfont icon-icon_sort_down"
        /></span>
        <span class="expense">总支出 ¥{{ bill.totalExpense }}</span>
        <span class="income">总收入 ¥{{ bill.totalIncome }}</span>
      </div>
    </div>
    <div class="content-wrap">
      <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          finished="finished"
          @load="onLoad"
          finished-text="没有更多了"
        >
          <CardItem v-for="item in bill.list" :item="item" :key="item"></CardItem>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="add" @click="popAddToggle">
      <van-icon name="records"></van-icon>
    </div>
    <!-- PopType -->
    <PopType ref="popTypeRef" @select="selectType" />
    <!-- PopMonth -->
    <PopMonth ref="popMonthRef" @select="selectMonth"></PopMonth>
    <!-- PopAdd -->
    <PopAdd ref="popAddRef" @refresh="onRefresh"></PopAdd>
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
    .content-wrap {
      height: calc(100% - 50px);
      overflow: hidden;
      overflow-y: scroll;
      background-color: #f5f5f5;
      padding: 10px;
    }
  }
  .add {
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #e9e9e9;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    color: #39be77;
  }
</style>
