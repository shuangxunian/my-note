<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ZoomEvent, DragEvent, PointerEvent, Box } from 'leafer-ui'
import { App } from 'leafer-editor'

interface LeaferChild {
  tag?: string
  x?: number
  y?: number
  width?: number
  height?: number
  strokeWidth?: number
  stroke?: string
  fill?: string
  text?: string
  children?: LeaferChild[]
}

interface LeaferJson {
  type?: string
  fill?: string
  children: LeaferChild[]
}

interface Line {
  tag: 'Line'
  x: number
  y: number
  width: number
  strokeWidth: number
  stroke: string
}

interface Text {
  tag: 'Text'
  x: number
  y: number
  text: string
  fill: string
}

type LineOrText = Line | Text

const props = withDefaults(
  defineProps<{
    activeIndex: number
  }>(),
  {
    activeIndex: 0,
  },
)

const leaferEditor = ref<HTMLElement | null>(null)
let app: App | null = null

const mousedown = (e: DragEvent) => {}
const mousemove = (e: DragEvent) => {}
const mouseup = (e: DragEvent) => {}

const buildLeafer = () => {
  app = new App({
    view: 'leafer-editor',
    fill: '#4B3C31',
    tree: {
      type: 'design',
    },
    zoom: { min: 1, max: 16 },
    move: { scroll: 'limit', drag: true },
  })

  const lineList: LineOrText[] = []
  for (let i = 1; i < 30; i++) {
    lineList.push({
      tag: 'Line',
      x: 58,
      y: 32 * i + 50,
      width: 700,
      strokeWidth: 1,
      stroke: '#999',
    })
  }
  for (let i = 1; i < 30; i++) {
    lineList.push({
      tag: 'Text',
      x: 58,
      y: 32 * i + 50,
      text: i + '',
      fill: 'black',
    })
  }

  const box = new Box({
    x: 0,
    y: 0,
    height: 1056,
    width: 816,
    fill: '#fbf0f0',
    children: lineList,
  })

  app.tree.add(box)
  // const box2 = new Box({
  //   x: 0,
  //   y: 0,
  //   height: 1056,
  //   width: 816,
  // })

  // app.tree.add(box2)

  const width = leaferEditor.value?.offsetWidth

  app.tree.zoom('fit', 0, true)
  // 监听
  app.tree.on(ZoomEvent.END, function (e: ZoomEvent) {
    // 如果外面的宽度大于当前这个组件的宽度才居中
    if (width > app.tree.children[0].worldBoxBounds.width) {
      // 居中逻辑
      app?.tree.zoom('fit', 0, true)
    }
  })
  console.log('jiazai')
  box.on(PointerEvent.DOWN, function (e: PointerEvent) {
    console.log('box down', e)
  })
  // app.on(DragEvent.DOWN, mousedown)
  // app.on(DragEvent.DRAG, mousemove)
  // app.on(DragEvent.UP, mouseup)
}

// 监听 activeIndex 的变化
watch(
  () => props.activeIndex,
  (newIndex) => {
    if (!app) return
    console.log(newIndex)
  },
  { immediate: true },
)

onMounted(() => {
  buildLeafer()
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
