<script setup lang="ts">
import { onMounted } from 'vue'
import { deleteDatabase } from '@/utils/IndexDB'
import { ElMessage } from 'element-plus'

const clearAllBook = async () => {
  try {
    await deleteDatabase()
  } catch (error) {
    ElMessage.error(error)
  }
}

onMounted(async () => {})
</script>

<template>
  <div class="user-info">
    <el-button @click="clearAllBook">清空全部笔记</el-button>
  </div>
</template>

<style lang="less" scoped>
.user-info {
}
</style>
