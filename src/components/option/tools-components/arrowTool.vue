<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import App from '@/utils/App'

const strokeWidth = ref<number>(3)
const stroke = ref<string>('#000000')

const colorChange = () => {
  if (!stroke.value) stroke.value = '#000000'
  App.changeDisposition('stroke', stroke.value)
}

watch(strokeWidth, (newWidth) => {
  App.changeDisposition('strokeWidth', newWidth)
})

onMounted(() => {
  App.changeDisposition('stroke', stroke.value)
  App.changeDisposition('strokeWidth', strokeWidth.value)
})
</script>

<template>
  <div class="arrow-tool">
    <div class="setting">
      <p>箭头粗细</p>
      <div class="slider">
        <el-slider v-model="strokeWidth" :min="1" :max="10" />
      </div>
    </div>
    <div class="setting">
      <p>箭头颜色</p>
      <div class="picker">
        <el-color-picker v-model="stroke" @change="colorChange" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.arrow-tool {
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
