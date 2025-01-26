<script setup lang="ts">
import { onMounted } from 'vue'
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

onMounted(async () => {})
</script>

<template>
  <div class="tools-index">
    <component :is="componentsList[props.activeIndex]"></component>
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
