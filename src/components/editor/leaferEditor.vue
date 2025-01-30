<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import App from '@/utils/App'

import type { IPage } from '@/types/book'

const leaferEditor = ref<HTMLElement | null>(null)

const props = withDefaults(
  defineProps<{
    activeIndex: number
    nowPage: number
    pageData: IPage
  }>(),
  {
    activeIndex: 0,
    nowPage: 0,
    pageData: () => ({
      pageID: '',
      bookID: '',
      pageNumber: 0,
      img: '',
    }),
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

// 监听 nowPage 的变化
watch(
  () => props.nowPage,
  async (newIndex) => {
    // await savePageData()
    // await getPageData()
  },
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
const getDataJson = () => {
  return JSON.stringify(App.getDataJson())
}
const setDataJson = (pageJson: string) => {
  App.setDataJson(JSON.parse(pageJson))
}

const buildLeafer = async () => {
  // await getPageData()
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
  })
}

const unloadLeafer = async () => {
  App.destroy()
}

onMounted(() => {
  buildLeafer()
})

onUnmounted(() => {
  unloadLeafer()
})

defineExpose({
  historyBack,
  historyUnBack,
  clearData,
  downLoad,
  getDataJson,
  setDataJson,
})
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
