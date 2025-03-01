import axios from 'axios'
import { showFailToast } from 'vant'
import router from '@/router/index.js'
import { useUserStore } from '@/stores/index.js'
const userStore = useUserStore()
const instance = axios.create({
  baseURL: 'http://192.168.10.5:7009/api/',
  timeout: 5000,
  // 允许跨域
  withCredentials: true
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 发送请求之前做些什么
    // 携带token
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (error) => {
    // 请求错误时做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    // console.log(router)
    if (response.data.code !== 200) {
      showFailToast(response.data.msg || '服务器错误')
      if (response.data.code === 401) {
        console.log(router)
        router.push('/login')
      }
      return Promise.reject(response.data)
    }
    return response.data
  },
  (error) => {
    // 请求错误时做些什么
    if (error.response?.data.code === 401) {
      console.log(router)
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default instance
