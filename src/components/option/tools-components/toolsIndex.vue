<script setup lang="ts">
import { ref, onMounted } from 'vue'
import App from '@/utils/App'
import SelectTool from './selectTool.vue'
import PenTool from './penTool.vue'
import rectTool from './rectTool.vue'
import ellipseTool from './ellipseTool.vue'
import lineTool from './lineTool.vue'
import arrowTool from './arrowTool.vue'
import textTool from './textTool.vue'
import eraserTool from './eraserTool.vue'
import dragTool from './dragTool.vue'

const props = withDefaults(
  defineProps<{
    activeIndex: number
  }>(),
  {
    activeIndex: 0,
  },
)

const componentsList = [
  SelectTool,
  PenTool,
  rectTool,
  ellipseTool,
  lineTool,
  arrowTool,
  textTool,
  eraserTool,
  dragTool,
]

const selectedGraphics = ref(null)
const nowSelectedGraphics = ref(0)

// 监听选中图形的变化
onMounted(() => {
  // 初始值
  selectedGraphics.value = App.getSelectedGraphics()?.value

  // 监听变化
  App.onSelectedGraphicsChange((newValue) => {
    selectedGraphics.value = newValue
    if (newValue) {
      const tagToIndex = {
        Select: 0, // 选择工具
        Path: 1, // 画笔工具
        Rect: 2, // 矩形工具
        Ellipse: 3, // 圆形工具
        Line: 4, // 直线工具
        Arrow: 5, // 箭头工具
        Text: 6, // 文字工具
        Eraser: 7, // 橡皮擦工具
      }

      nowSelectedGraphics.value = tagToIndex[newValue.tag] ?? 0 // 如果找不到对应的工具，默认返回选择工具(0)
    }
  })
})
</script>

<template>
  <div class="tools-index">
    <component
      :is="componentsList[props.activeIndex ? props.activeIndex : nowSelectedGraphics]"
      :selected-graphics="selectedGraphics"
    ></component>
  </div>
</template>

<style lang="less" scoped>
.tools-index {
  width: calc(100%-20px);
  height: calc(100% -24px);
  padding: 10px 12px;
  font-size: 14px;
  color: #666;
  line-height: 20px;
}
</style>
