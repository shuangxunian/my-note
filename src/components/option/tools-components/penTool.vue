<script setup lang="ts">
import { ref, onMounted } from 'vue'

const strokeWidth = ref<number>(0)
const stroke = ref<string>('#000000')

const colorChange = () => {
  if (!stroke.value) stroke.value = '#000000'
  // console.log(stroke.value)
  // stroke.value = '#000000'
}

onMounted(async () => {})
</script>

<template>
  <div class="pen-tool">
    <div class="setting">
      <p>画笔粗细</p>
      <div class="slider">
        <el-slider v-model="strokeWidth" :min="1" :max="10" />
      </div>
    </div>
    <div class="setting">
      <p>画笔颜色</p>
      <div class="picker">
        <el-color-picker v-model="stroke" @change="colorChange" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.pen-tool {
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
