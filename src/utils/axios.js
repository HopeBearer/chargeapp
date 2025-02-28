import axios from 'axios'
import { showFailToast } from 'vant'
import { useRouter } from 'vue-router'
// Create a new instance of axios with some default configuration
const instance = axios.create({
  baseURL: 'http://192.168.10.5:7009/api/',
  timeout: 5000,
  // 允许跨域
  withCredentials: true,
  headers: {
    token: localStorage.getItem('token') || ''
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 发送请求之前做些什么

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
    const router = useRouter()
    if (typeof response.data !== 'object') {
      showFailToast('服务器错误')
      return Promise.reject(response)
    }
    // code非200的情况
    if (response.data.code !== 200) {
      if (response.data.msg) showFailToast(response.data.msg)
      if (response.data.code === 401) {
        router.push('/login')
      }
      return Promise.reject(response.data)
    }
    return response.data
  },
  (error) => {
    // 请求错误时做些什么
    return Promise.reject(error)
  }
)

export default instance
