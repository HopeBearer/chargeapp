<script setup>
  import { ref } from 'vue'
  import dayjs from 'dayjs'
  // 控制弹窗显示变量
  const showMonthPopup = ref(false)
  // 当前日期
  const curDate = ref([new Date().getFullYear(), new Date().getMonth() + 1])
  const minDate = ref(dayjs().subtract(10, 'year').toDate())
  // 最大日期为当前日期
  const maxDate = dayjs(curDate.value).toDate()
  // 日期格式化
  const formatter = (type, option) => {
    if (type === 'year') {
      option.text += '年'
    } else if (type === 'month') {
      option.text += '月'
    }
    return option
  }
  // 控制弹窗显示/隐藏
  const toggle = () => {
    showMonthPopup.value = !showMonthPopup.value
  }

  defineExpose({
    // 交由父组件调用
    toggle
  })
  const emit = defineEmits(['select'])
  // 选择月份
  const chooseMonth = (date) => {
    const [year, month] = date.selectedValues
    curDate.value = date.selectedValues
    toggle()
    emit('select', dayjs([year, month]).format('YYYY-MM'))
  }
</script>
<template>
  <van-popup v-model:show="showMonthPopup" position="bottom" round :style="{ height: '46%' }">
    <van-date-picker
      v-model="curDate"
      :columns-type="['year', 'month']"
      title="选择月份"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="formatter"
      @confirm="chooseMonth"
      @cancel="toggle"
    ></van-date-picker>
  </van-popup>
</template>
<style scoped></style>
