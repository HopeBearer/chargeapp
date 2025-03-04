import { getUserInfoService } from '@/api/user.js'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore(
  'user',
  () => {
    // token
    const token = ref('')

    // 用户相关
    const userInfo = ref({})
    // 获取用户信息
    const getUserInfo = async () => {
      const res = await getUserInfoService()
      console.log(res)
      return userInfo.value
    }
    // 设置用户信息
    const setUserInfo = (newInfo) => {
      userInfo.value = newInfo
    }
    return {
      token,
      userInfo,
      getUserInfo,
      setUserInfo
    }
  },
  {
    persist: true
  }
)
