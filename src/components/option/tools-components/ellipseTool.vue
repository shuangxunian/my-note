<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import App from '@/utils/App'

const strokeWidth = ref<number>(1)
const stroke = ref<string>('#000000')
const fill = ref<string | null>(null)

const strokeColorChange = () => {
  // 只有两个都为null时才必须存在边框
  if (!stroke.value && !fill.value) stroke.value = '#000000'
  App.changeDisposition('stroke', stroke.value)
}

const fillColorChange = () => {
  App.changeDisposition('fill', fill.value)
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
  <div class="ellipse-tool">
    <div class="setting">
      <p>边框粗细</p>
      <div class="slider">
        <el-slider v-model="strokeWidth" :min="1" :max="10" />
      </div>
    </div>
    <div class="setting">
      <p>边框颜色</p>
      <div class="picker">
        <el-color-picker v-model="stroke" @change="strokeColorChange" />
      </div>
    </div>
    <div class="setting">
      <p>填充颜色</p>
      <div class="picker">
        <el-color-picker v-model="fill" @change="fillColorChange" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ellipse-tool {
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
