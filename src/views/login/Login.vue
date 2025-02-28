<script setup>
  // 1. import Header component
  import Header from '@/components/Header.vue'
  import { userLoginService, userRegisterService } from '@/api/user.js'
  import { showFailToast, showSuccessToast } from 'vant'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/index.js'

  import { ref } from 'vue'
  // 路由
  const router = useRouter()
  // 记录当前页是登录还是注册
  const isLogin = ref('login')
  const verifyRef = ref(null)
  // 更换当前页记录
  const chanegType = (type) => {
    isLogin.value = type
    // 重置表单数据
    formUserInfo.value = {
      username: '',
      password: '',
      verify: '',
      imgCode: '',
      type: isLogin.value
    }
  }

  // 需要填写 的 表单数据
  const formUserInfo = ref({
    username: '',
    password: '',
    type: isLogin.value,
    verify: '',
    imgCode: ''
  })

  const userStore = useUserStore()
  // 提交表单
  const onSubmit = async () => {
    if (isLogin.value == 'login') {
      // console.log('登录')
      // 发送请求
      const res = await userLoginService(formUserInfo.value)
      console.log(res)
      // 存储token
      userStore.token = res.data.token
      showSuccessToast('登录成功')
      // 登录成功后跳转到首页
      router.push('/')
    } else {
      if (formUserInfo.value.imgCode !== verifyRef.value.verify) {
        showFailToast('验证码错误')
        return
      }
      // 发送请求
      await userRegisterService(formUserInfo.value)
      showSuccessToast('注册成功')
      // 注册成功后跳转到登录页
      router.push('/login')
    }
  }
</script>
<template>
  <!--1-->
  <Header :title="isLogin == 'login' ? '登录' : '注册'" />
  <div class="auth">
    <img class="logo" src="//s.yezgea02.com/1606836859539/onpeice.png" alt="" />
    <!--2-->
    <van-form class="form-wrap" v-if="isLogin == 'login'">
      <div class="form">
        <van-field
          clearable
          v-model="formUserInfo.username"
          name="username"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请填写账户' }]"
        />
        <van-field
          clearable
          v-model="formUserInfo.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </div>
      <div style="margin: 16px 0">
        <van-button round block type="primary" @click="onSubmit" native-type="submit">
          登录
        </van-button>
        <!--3-->
        <p @click="chanegType('register')" class="change-btn">没有账号，前往注册</p>
      </div>
    </van-form>
    <!--4-->
    <van-form class="form-wrap" v-if="isLogin === 'register'">
      <div class="form">
        <van-field
          clearable
          v-model="username"
          name="username"
          label="账号"
          placeholder="请输入账号"
          autocomplete="off"
          :rules="[{ required: true, message: '请填写账号' }]"
        />
        <van-field
          clearable
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          clearable
          center
          label="验证码"
          placeholder="请输入验证码"
          :rules="[{ required: true, message: '请填写验证码' }]"
          v-model="verify"
        >
          <template #button>
            <VueImageVerify ref="verifyRef"></VueImageVerify>
          </template>
        </van-field>
      </div>
      <div style="margin: 16px 0">
        <van-button round block type="primary" :loading="loading" native-type="submit">
          注册
        </van-button>
        <!--5-->
        <p @click="chanegType('login')" class="change-btn">登录已有账号</p>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
  .auth {
    height: calc(100% - 46px);
    padding: 30px 20px 0 20px;
    background: $primary-bg;
    .logo {
      width: 150px;
      display: block;
      margin: 0 auto;
      margin-bottom: 30px;
    }
    .form-wrap {
      .form {
        border-radius: 10px;
        overflow: hidden;
        .van-cell:first-child {
          padding-top: 20px;
        }
        .van-cell:last-child {
          padding-bottom: 20px;
        }
      }
    }
    .change-btn {
      text-align: center;
      margin: 10px 0;
      color: $link-color;
      font-size: 14px;
    }
  }
</style>
