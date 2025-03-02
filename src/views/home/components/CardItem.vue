<script setup>
  import useFormatDate from '@/composables/useFormatDate'
  defineProps({
    item: {
      type: Object,
      required: true,
      default: () => ({})
    }
  })
  const { formatDate } = useFormatDate()

  //
</script>
<template>
  <van-cell-group class="item">
    <div class="header-date">
      <div>{{ item.date }}</div>
      <div class="money">
        <span
          ><b>支</b>-{{
            item.bills
              .filter((bill) => bill.pay_type === 1)
              .reduce((sum, bill) => sum + parseInt(bill.amount), 0)
              .toFixed(2)
          }}</span
        >
        <span
          ><b>收</b>+{{
            item.bills
              .filter((bill) => bill.pay_type === 2)
              .reduce((sum, bill) => sum + parseInt(bill.amount), 0)
              .toFixed(2)
          }}</span
        >
      </div>
    </div>
    <van-cell
      v-for="bill in item.bills"
      :key="bill.id"
      :value="bill.pay_type === 1 ? '-' + bill.amount : '+' + bill.amount"
      :value-class="{ expense: bill.pay_type === 1, income: bill.pay_type === 2 }"
      :title="bill.type_name"
      :label="
        formatDate(bill.date).slice(formatDate(bill.date).lastIndexOf(' ') + ' '.length) +
        (bill.remark ? ' | ' + bill.remark : '')
      "
      :to="`/detail?id=${bill.id}`"
    />
    <!-- <van-cell class="income" title="餐饮" value="+12.00" label="12:00 | 我是备注信息" /> -->
  </van-cell-group>
</template>
<style lang="scss" scoped>
  .item {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    .header-date {
      height: 60px;
      display: flex;
      background-color: #f9f9f9;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      div {
        color: $color-text-base;
      }
      .money {
        span {
          margin-left: 20px;
          b {
            color: #000;
            font-weight: normal;
            background-color: #f5f5f5;
            padding: 3px;
            margin-right: 2px;
          }
        }
      }
    }
  }
  :deep(.income) {
    color: $color-text-income;
  }
</style>
