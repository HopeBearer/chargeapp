<script setup>
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { delBillService, getBillDetailService } from '@/api/account.js'
  import useFormatDate from '@/composables/useFormatDate'
  import PopAdd from './components/PopAdd.vue'
  import { showConfirmDialog, showSuccessToast } from 'vant'

  const route = useRoute()
  const router = useRouter()
  const billDetail = ref({})
  const getBillDetail = async () => {
    const res = await getBillDetailService(route.query.id)
    console.log(res)
    billDetail.value = res.data
  }
  getBillDetail()
  const { formatDate } = useFormatDate()

  const popAddRef = ref(null)
  const edit = () => {
    popAddRef.value.toggle()
  }
  const delBill = async () => {
    await showConfirmDialog({
      title: '温馨提示',
      message: '确认删除该账单？'
    })
      .then(() => {
        delBillService(billDetail.value.id)
        router.replace('/home')
        showSuccessToast('删除成功')
      })
      .catch(() => {})
  }
</script>
<template>
  <div class="detail">
    <Header title="账单详情" />
    <div class="card">
      <div class="type">
        <span>
          <i class="iconfont canyin" />
        </span>
        <span>{{ billDetail.type_name }}</span>
      </div>
      <div class="amount">
        {{ billDetail.pay_type === 1 ? '-' + billDetail.amount : '+' + billDetail.amount }}
      </div>
      <div class="info">
        <div class="time">
          <span>记录时间</span>
          <span>{{ formatDate(billDetail.date) }}</span>
        </div>
        <div class="remark">
          <span>备注</span>
          <span>{{ billDetail.remark ? '：' + billDetail.remark : '-' }}</span>
        </div>
      </div>
      <div class="operation van-hairline--top">
        <span class="van-hairline--right" @click="delBill"><van-icon name="delete" />删除</span>
        <span @click="edit"><van-icon name="edit" />编辑</span>
      </div>
      <PopAdd
        v-if="billDetail.id"
        ref="popAddRef"
        :detail="billDetail"
        @refresh="getBillDetail"
      ></PopAdd>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .detail {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
    padding: 12px 24px 0 24px;
  }
  .card {
    border-radius: 12px;
    background-color: #fff;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .type {
      padding: 24px 0 12px 0;
      span:nth-of-type(1) {
        display: inline-block;
        width: 22px;
        height: 22px;
        color: #fff;
        border-radius: 50%;
        text-align: center;
        line-height: 20px;
        margin-right: 8px;
      }
      .expense {
        background-color: $primary;
      }
      .income {
        background-color: $text-warning;
      }
    }
    .amount {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .info {
      width: 100%;
      font-size: 14px;
      text-align: left;
      .time {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 12px;
        span:nth-of-type(1) {
          flex: 3;
          color: $color-text-caption;
        }
        span:nth-of-type(2) {
          flex: 9;
        }
      }
      .remark {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 12px;
        span:nth-of-type(1) {
          flex: 3;
          color: $color-text-caption;
        }
        span:nth-of-type(2) {
          flex: 9;
          color: $color-text-base;
        }
      }
    }
    .operation {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      font-size: 16px;
      .van-icon {
        margin-right: 4px;
      }
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        flex: 1;
      }
      span:nth-of-type(1) {
        color: red;
      }
    }
  }
</style>
