<script setup>
  import { ref, onMounted } from 'vue'
  import PopMonth from './components/PopMonth.vue'
  import dayjs from 'dayjs'
  import { getMonthDataService } from '@/api/account'
  import { typeMap } from '@/utils/index.js'
  import * as echarts from 'echarts'

  const popMonthRef = ref(null)

  const monthToggle = () => {
    popMonthRef.value.toggle()
  }
  const curMonth = ref(dayjs().format('YYYY-MM'))
  const totalExpense = ref(0)
  const totalIncome = ref(0)
  onMounted(() => {
    getData()
  })

  const expenseData = ref([])
  const incomeData = ref([])

  const totalType = ref('expense')
  const pieType = ref('expense')
  const getData = async () => {
    const res = await getMonthDataService(curMonth.value)
    console.log(res)
    totalExpense.value = res.data.total_expense
    totalIncome.value = res.data.total_income
    expenseData.value = res.data.total_data
      .filter((item) => item.pay_type === 1)
      .sort((a, b) => b.number - a.number)
    incomeData.value = res.data.total_data
      .filter((item) => item.pay_type === 2)
      .sort((a, b) => b.number - a.number)

    setPieChart()
  }
  const changeTotalType = (type) => {
    totalType.value = type
  }

  const setPieChart = () => {
    const proportionChart = echarts.init(document.getElementById('proportion'))
    const _data = pieType.value == 'expense' ? expenseData.value : incomeData.value
    proportionChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      // 图例
      legend: {
        data: _data.map((item) => item.type_name)
      },
      series: [
        {
          name: '支出',
          type: 'pie', // 图标类型
          radius: '55%',
          // 饼图数据
          data: _data.map((item) => {
            return {
              value: item.number,
              name: item.type_name
            }
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
  }
  // 切换饼图收支类型
  const changePieType = (type) => {
    pieType.value = type
    // 重绘饼图
    setPieChart()
  }
</script>
<template>
  <div class="data">
    <div class="total">
      <div class="time" @click="monthToggle">
        <span>{{ curMonth }}</span>
        <van-icon name="notes-o" />
      </div>
      <div class="title">共支出</div>
      <div class="expense">¥{{ totalExpense || 0 }}</div>
      <div class="income">共收入¥{{ totalIncome || 0 }}</div>
    </div>
    <div class="structure">
      <div class="head">
        <span class="title">收支构成</span>
        <div class="tab">
          <span
            @click="changeTotalType('expense')"
            class="expense"
            :class="{ active: totalType == 'expense' }"
          >
            支出
          </span>
          <span
            @click="changeTotalType('income')"
            class="income"
            :class="{ active: totalType == 'income' }"
          >
            收入
          </span>
        </div>
      </div>
      <div class="content">
        <div
          class="item"
          v-for="item in totalType == 'expense' ? expenseData : incomeData"
          :key="item.type_id"
        >
          <div class="left">
            <div class="type">
              <span :class="{ expense: totalType == 'expense', income: totalType == 'income' }">
                <i class="iconfont" :class="item.type_id ? typeMap[item.type_id].icon : 0" />
              </span>
              <span>{{ item.type_name }}</span>
            </div>
            <div class="progress">
              {{
                Number(
                  (item.number / Number(totalType == 'expense' ? totalExpense : totalIncome)) * 100
                ).toFixed(2)
              }}%
            </div>
          </div>
          <div class="right">
            <div class="percent">
              <van-progress
                :percentage="
                  Number(
                    (item.number / Number(totalType == 'expense' ? totalExpense : totalIncome)) *
                      100
                  )
                "
                stroke-width="6px"
                :show-pivot="false"
                track-color="#ffffff"
                color="#39be77"
              />
            </div>
            <div class="money">¥{{ Number(item.number).toFixed(2) || 0 }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="proportion">
      <div class="head">
        <span class="title">收支构成</span>
        <div class="tab">
          <span
            @click="changePieType('expense')"
            class="expense"
            :class="{ active: pieType == 'expense' }"
            >支出</span
          >
          <span
            @click="changePieType('income')"
            class="income"
            :class="{ active: pieType == 'income' }"
            >收入</span
          >
        </div>
      </div>
      <div id="proportion"></div>
    </div>
    <PopMonth ref="popMonthRef" @select="selectMonth"></PopMonth>
  </div>
</template>
<style lang="scss" scoped>
  .data {
    min-height: 100%;
    background-color: #f5f5f5;
    .total {
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 0;
      margin-bottom: 10px;
      .time {
        position: relative;
        width: 96px;
        padding: 6px;
        background-color: #f5f5f5;
        color: $color-text-base;
        border-radius: 4px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        span:nth-of-type(1)::after {
          content: '';
          position: absolute;
          top: 9px;
          bottom: 8px;
          right: 28px;
          width: 1px;
          background-color: rgba(0, 0, 0, 0.5);
        }
        .van-icon-notes-o {
          font-size: 16px;
          color: $color-text-caption;
        }
      }
      .title {
        color: $primary;
        margin-bottom: 8px;
        font-size: 12px;
        font-weight: 500;
      }
      .expense {
        font-size: 24px;
        color: $primary;
        font-weight: 600;
        margin-bottom: 16px;
      }
      .income {
        color: $color-text-caption;
        font-weight: 500;
        font-size: 12px;
      }
    }
    .structure {
      padding: 0 16px;
      background-color: #fff;
      margin-bottom: 10px;
      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        .title {
          font-size: 18px;
          color: $color-text-base;
        }
        .tab {
          span {
            display: inline-block;
            width: 40px;
            height: 24px;
            background-color: #f5f5f5;
            text-align: center;
            line-height: 24px;
            margin-left: 10px;
            border-radius: 4px;
            font-size: 14px;
          }
          .expense {
            &.active {
              background-color: rgba(57, 190, 119, 0.2);
              color: $primary;
            }
          }
          .income {
            &.active {
              background-color: rgba(236, 190, 37, 0.2);
              color: $text-warning;
            }
          }
        }
      }
      .content {
        .item {
          display: flex;
          height: 50px;
          align-items: center;
          .left {
            flex: 4;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-right: 10px;
            font-size: 12px;
            white-space: nowrap; /* 禁止换行 */
            // overflow: hidden; /* 隐藏溢出内容 */
            // text-overflow: ellipsis; /* 显示省略号 */
            .type {
              display: flex;
              align-items: center;

              span:nth-of-type(1) {
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                margin-right: 10px;
                color: #fff;
              }
              .expense {
                background-color: $primary;
              }
              .income {
                background-color: $text-warning;
              }
            }
          }
          .right {
            flex: 8;
            display: flex;
            align-items: center;
            .percent {
              width: 160px;
            }
            .momey {
              width: 100px;
            }
          }
        }
      }
    }
    .proportion {
      background-color: #fff;
      padding: 12px;
      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        .title {
          font-size: 18px;
          color: $color-text-base;
        }
        .tab {
          span {
            display: inline-block;
            width: 40px;
            height: 24px;
            background-color: #f5f5f5;
            text-align: center;
            line-height: 24px;
            margin-left: 10px;
            border-radius: 4px;
          }
          .expense {
            &.active {
              background-color: rgba(57, 190, 119, 0.2);
              color: $primary;
            }
          }
          .income {
            &.active {
              background-color: rgba(236, 190, 37, 0.2);
              color: $text-warning;
            }
          }
        }
      }
      #proportion {
        width: 100%;
        height: 400px;
      }
    }
  }
</style>
