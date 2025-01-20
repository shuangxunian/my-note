<script setup lang="ts">
import { ref, onMounted } from 'vue'

// import useCounterStore from '@/store/counter'
// import myRequest from '@/service'

// myRequest
//   .get({
//     url: 'api/home',
//   })
//   .then((res) => {
//     console.log(res)
//   })

// const counterStore = useCounterStore()

// const countChange = () => {
//   counterStore.increment()
// }

const breakUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  window.location.reload()
}

onMounted(async () => {})
</script>

<template>
  <div class="all-page">
    <el-button @click="breakUser">退出登录</el-button>
  </div>
</template>

<style lang="less" scoped>
.all-page {
}
</style>
