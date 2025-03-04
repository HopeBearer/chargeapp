<script setup>
  import { ref, onMounted } from 'vue'
  import dayjs from 'dayjs'
  import { editBillService, getTypeListService } from '@/api/account'
  import { typeMap } from '@/utils/index.js'
  import { showFailToast, showSuccessToast } from 'vant'
  import { addBillService } from '@/api/account.js'

  const prop = defineProps({
    detail: {
      type: Object,
      default: () => ({})
    }
  })
  const id = ref(prop.detail && prop.detail.id)
  const showAdd = ref(false)

  const toggle = () => {
    showAdd.value = !showAdd.value
  }
  defineExpose({
    toggle
  })
  const payType = ref(id.value ? (prop.detail.pay_type === 1 ? 'expense' : 'income') : 'expense')
  const changeType = (type) => {
    payType.value = type
    currentType.value = type == 'expense' ? expense.value[0] : income.value[0]
  }
  const curDate = ref(id.value ? prop.detail.date : dayjs().valueOf())
  const date = ref(dayjs(curDate.value).format('YYYY-MM-DD').split('-'))
  const minDate = ref(dayjs().subtract(10, 'year').toDate())
  // 最大日期为当前日期
  const showDay = ref(false)
  const choseDay = () => {
    showDay.value = true
  }

  const amount = ref(id.value ? prop.detail.amount : '')
  const remove = () => {
    amount.value = amount.value.slice(0, amount.value.length - 1)
  }

  const inputChange = (value) => {
    if (value == '.' && amount.value.includes('.')) return
    if (
      value != '.' &&
      amount.value.includes('.') &&
      amount.value &&
      amount.value.split('.')[1].length >= 2
    )
      return

    amount.value += value
  }
  const expense = ref([])
  const income = ref([])
  const currentType = ref(id.value ? { id: prop.detail.type_id, name: prop.detail.type_name } : {})
  onMounted(async () => {
    const res = await getTypeListService()
    expense.value = res.data.list.filter((item) => item.type == 1)
    income.value = res.data.list.filter((item) => item.type == 2)
    currentType.value = res.data.list[0]
  })

  const selectType = (item) => {
    currentType.value = item
  }
  const remarkVisible = ref(false)
  const remark = ref(id.value ? prop.detail.remark : '')
  const emit = defineEmits(['refresh'])

  const addBill = async () => {
    if (!amount.value) {
      showFailToast('请输入具体金额')
      return
    }
    const params = {
      amount: Number(amount.value).toFixed(2),
      type_id: currentType.value.id,
      type_name: currentType.value.name,
      date: dayjs().valueOf(),
      pay_type: payType.value == 'expense' ? 1 : 2,
      remark: remark.value || ''
    }
    if (id.value) {
      params.id = id.value
      // 有 id 的情况下为 编辑状态
      await editBillService(params)
      showAdd.value = false
      showDay.value = false
      showSuccessToast('编辑成功')
      emit('refresh')
    } else {
      await addBillService(params)
      // 清空数据
      amount.value = ''
      remark.value = ''
      payType.value = 'expense'
      currentType.value = expense.value[0]
      showAdd.value = false
      showDay.value = false
      date.value = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]
      showSuccessToast('添加成功')
      emit('refresh')
    }
  }
</script>
<template>
  <van-popup
    v-if="showAdd"
    v-model:show="showAdd"
    position="bottom"
    round
    :style="{ height: '70%' }"
  >
    <div class="add-wrap">
      <header class="header">
        <span class="close" @click="showAdd = false">
          <van-icon name="cross" />
        </span>
        <van-button class="add-btn" type="primary" @click="addBill" size="small"> 确定 </van-button>
      </header>
      <div class="filter">
        <div class="type">
          <span
            @click="changeType('expense')"
            :class="{ expense: true, active: payType == 'expense' }"
          >
            支出
          </span>
          <span
            @click="changeType('income')"
            :class="{ income: true, active: payType == 'income' }"
          >
            收入
          </span>
        </div>
        <div @click="showDay = true" class="time">
          {{ dayjs(date).format('YYYY-MM-DD') }}
          <i class="iconfont sort-down" />
        </div>
      </div>
      <div class="money">
        <span class="sufix">¥</span>
        <span class="amount animation">{{ amount }}</span>
      </div>
      <div class="type-warp">
        <div class="type-body" v-if="payType == 'expense'">
          <div class="type-item" v-for="item in expense" :key="item.id" @click="selectType(item)">
            <span
              :class="{
                'iconfont-wrap': true,
                expense: true,
                active: currentType.id == item.id
              }"
            >
              <i class="iconfont" :class="typeMap[item.id].icon" />
            </span>
            {{ item.name }}
          </div>
        </div>
        <div class="type-body" v-if="payType == 'income'">
          <div class="type-item" v-for="item in income" :key="item.id" @click="selectType(item)">
            <span
              :class="{
                'iconfont-wrap': true,
                income: true,
                active: currentType.id == item.id
              }"
            >
              <i class="iconfont" :class="typeMap[item.id].icon" />
            </span>
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="remark" v-if="remark" @click="remarkVisible = true">
        {{ remark }}
      </div>
      <div class="remark" v-else @click="remarkVisible = true">添加备注</div>
      <van-dialog v-model:show="remarkVisible" title="备注" show-cancel-button>
        <van-field
          v-model="remark"
          rows="2"
          autosize
          type="textarea"
          maxlength="10"
          placeholder="请输入备注"
          show-word-limit
        />
      </van-dialog>
      <van-number-keyboard :show="true" extra-key="." @delete="remove" @input="inputChange" />
      <van-popup v-model:show="showDay" position="bottom" round :style="{ height: '46%' }">
        <van-date-picker
          v-model="date"
          type="date"
          title="选择时间"
          :min-date="minDate"
          @confirm="choseDay"
          @cancel="showDay = false"
        />
      </van-popup>
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
    .filter {
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .type {
        span {
          display: inline-block;
          background: #f5f5f5;
          color: $color-text-caption;
          padding: 4px 12px;
          font-size: 12px;
          border-radius: 24px;
          border: 1px solid #f5f5f5;
        }
        .expense {
          margin-right: 6px;
          &.active {
            background-color: #eafbf6;
            border-color: $primary;
            color: $primary;
          }
        }
        .income {
          &.active {
            background-color: #fbf8f0;
            border-color: $text-warning;
            color: $text-warning;
          }
        }
      }
    }
    .time {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px 12px;
      background-color: #f0f0f0;
      border-radius: 20px;
      color: $color-text-base;
      .sort-down {
        font-size: 12px;
        margin-left: 5px;
      }
    }
    .money {
      padding-bottom: 12px;
      border-bottom: 1px solid #e9e9e9;
      margin: 0 24px;
      .sufix {
        font-size: 36px;
        font-weight: bold;
        vertical-align: top;
      }
    }
    .amount {
      font-size: 40px;
      padding-left: 10px;
    }

    .animation::after {
      content: '';
      display: inline-block;
      margin-left: 5px;
      width: 2px;
      height: 28px;
      animation: blink 1s infinite steps(1, start);
    }
    @keyframes blink {
      0% {
        background-color: white;
      }
      50% {
        background-color: $color-text-secondary;
      }
      100% {
        background-color: white;
      }
    }
    .van-number-keyboard {
      position: unset;
    }
    .type-warp {
      display: flex;
      overflow-x: auto;
      margin: 0 24px;
      margin-bottom: 20px;
      * {
        touch-action: pan-x;
      }
      .type-body {
        display: flex;
        white-space: nowrap;
        .type-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 16px 12px 10px 12px;
          .iconfont-wrap {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f5f5f5;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            margin-bottom: 5px;
            .iconfont {
              color: $color-text-caption;
              font-size: 20px;
            }
          }
          .expense {
            &.active {
              background-color: $primary;
              .iconfont {
                color: #fff;
              }
            }
          }
          .income {
            &.active {
              background-color: $text-warning;
              .iconfont {
                color: #fff;
              }
            }
          }
        }
      }
    }
    .remark {
      padding: 0 24px;
      padding-bottom: 12px;
      color: #4b67e2;
    }
  }
</style>
