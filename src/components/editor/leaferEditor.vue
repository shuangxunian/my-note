<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import App from '@/utils/App'

const leaferEditor = ref<HTMLElement | null>(null)

const props = withDefaults(
  defineProps<{
    activeIndex: number
  }>(),
  {
    activeIndex: 0,
  },
)

// 监听 activeIndex 的变化
watch(
  () => props.activeIndex,
  (newIndex) => {
    App.activeIndexChange(newIndex)
  },
  { immediate: true }, // 立即执行一次
)

const historyBack = () => {
  App.historyBack()
}
const historyUnBack = () => {
  App.historyUnBack()
}
const clearData = () => {
  App.clearData(props.activeIndex)
}
const downLoad = () => {
  App.downLoad()
}

defineExpose({
  historyBack,
  historyUnBack,
  clearData,
  downLoad,
})

onMounted(() =>
  App.init({
    domId: 'leafer-editor',
    config: {
      // 增加工具栏组件
      toolbar: [],
    },
    userDefinedData: {
      bodyWidth: leaferEditor.value?.offsetWidth || 0,
    },
    onChange: (json) => {
      console.log(json)
    },
  }),
)

onUnmounted(() => App.destroy())
</script>

<template>
  <div ref="leaferEditor" id="leafer-editor" class="leafer-editor"></div>
</template>

<style lang="less" scoped>
.leafer-editor {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
