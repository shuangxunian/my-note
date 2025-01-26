<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import App from '@/utils/App'

const fontSize = ref<number>(24)
const fill = ref<string>('#000000')

const props = defineProps<{
  selectedGraphics: any
}>()

watch(
  () => props.selectedGraphics,
  (newValue) => {
    if (newValue) {
      fontSize.value = newValue.fontSize || 24
      fill.value = newValue.fill || '#000000'
    }
  },
  { immediate: true },
)

const colorChange = () => {
  if (!fill.value) fill.value = '#000000'
  App.changeDisposition('fill', fill.value)
}

watch(fontSize, (newWidth) => {
  App.changeDisposition('fontSize', newWidth)
})

onMounted(() => {
  App.changeDisposition('fill', fill.value)
  App.changeDisposition('fontSize', fontSize.value)
})
</script>

<template>
  <div class="text-tool">
    <div class="setting">
      <p>文字大小</p>
      <div class="slider">
        <el-slider v-model="fontSize" :min="12" :max="48" />
      </div>
    </div>
    <div class="setting">
      <p>文字颜色</p>
      <div class="picker">
        <el-color-picker v-model="fill" @change="colorChange" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.text-tool {
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
