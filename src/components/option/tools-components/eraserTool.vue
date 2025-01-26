<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import App from '@/utils/App'

const strokeWidth = ref<number>(1)

watch(strokeWidth, (newWidth) => {
  App.changeDisposition('strokeWidth', newWidth)
})

onMounted(() => {
  App.changeDisposition('strokeWidth', strokeWidth.value)
})
</script>

<template>
  <div class="eraser-tool">
    <div class="setting">
      <p>橡皮粗细</p>
      <div class="slider">
        <el-slider v-model="strokeWidth" :min="1" :max="60" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.eraser-tool {
  display: flex;
  flex-direction: column;
  gap: 8px;
  .setting {
    .slider {
      margin: 0 10px;
    }
    .picker {
      margin-top: 6px;
    }
  }
}
</style>
