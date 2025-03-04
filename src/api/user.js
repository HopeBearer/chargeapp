import instance from '@/utils/axios.js'

// 用户登录
export const userLoginService = ({ username, password }) =>
  instance.post('/user/login', {
    username,
    password
  })

// 用户注册
export const userRegisterService = (userInfo) => instance.post('/user/register', userInfo)

// 获取用户信息
export const getUserInfoService = () => instance.get('/user/get_userinfo')
