<script setup>
  import { ref, onMounted } from 'vue'

  const verify = ref(null)

  const state = ref({
    pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    width: 120,
    height: 40,
    imgCode: ''
  })
  onMounted(() => {
    state.value.imgCode = draw()
  })
  // 点击图片重新绘制
  const handleDraw = () => {
    state.value.imgCode = draw()
  }
  // 随机数
  const randomNum = (min, max) => {
    return parseInt(Math.random() * (max - min) + min)
  }
  // 随机颜色
  const randomColor = (min, max) => {
    const r = randomNum(min, max)
    const g = randomNum(min, max)
    const b = randomNum(min, max)
    return `rgb(${r},${g},${b})`
  }

  const draw = () => {
    const ctx = verify.value.getContext('2d')
    ctx.fillStyle = randomColor(180, 230)
    ctx.fillRect(0, 0, state.value.width, state.value.height)
    let imgCode = ''
    // 随机产生字符串，并且随机旋转
    for (let i = 0; i < 4; i++) {
      const text = state.value.pool[randomNum(0, state.value.pool.length)]
      imgCode += text
      ctx.fontSize = randomNum(18, 40)
      const deg = randomNum(-30, 30)
      ctx.font = ctx.fontSize + 'px simhei'
      ctx.textBaseline = 'top'
      ctx.fillStyle = randomColor(80, 150)
      ctx.save()
      ctx.translate(30 * i + 15, 15)
      ctx.rotate((deg * Math.PI) / 180)
      ctx.fillText(text, -15 + 5, -15)
      ctx.restore()
    }
    // 绘制干扰线
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      ctx.moveTo(randomNum(0, state.value.width), randomNum(0, state.value.height))
      ctx.lineTo(randomNum(0, state.value.width), randomNum(0, state.value.height))
      ctx.strokeStyle = randomColor(180, 230)
      ctx.closePath()
      ctx.stroke()
    }
    // 绘制干扰点
    for (let i = 0; i < 40; i++) {
      ctx.beginPath()
      ctx.arc(randomNum(0, state.value.width), randomNum(0, state.value.height), 1, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fillStyle = randomColor(150, 200)
      ctx.fill()
    }
    return imgCode
  }
</script>

<template>
  <div class="img-verify">
    <canvas ref="verify" :width="state.width" :height="state.height" @click="handleDraw"></canvas>
  </div>
</template>
<style scoped>
  .img-verify canvas {
    cursor: pointer;
  }
</style>
