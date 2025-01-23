<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ZoomEvent, LeafHelper } from 'leafer-ui'
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

const leaferEditor = ref(null)

const buildLeafer = () => {
  const app = new App({
    view: 'leafer-editor',
    fill: '#4B3C31',
    tree: {
      type: 'design',
    },
    editor: {},
    zoom: { min: 1, max: 16 },
    move: { scroll: 'limit', drag: true },
  })

  const json: LeaferJson = {
    children: [],
  }
  json.children.push({
    tag: 'Box',
    height: 1056,
    width: 816,
    fill: '#fbf0f0',
    children: [],
  })
  for (let i = 1; i < 30; i++) {
    json.children[0]?.children.push({
      tag: 'Line',
      x: 58,
      y: 32 * i + 50,
      width: 700,
      strokeWidth: 1,
      stroke: '#999',
    })
  }
  for (let i = 1; i < 30; i++) {
    json.children[0]?.children.push({
      tag: 'Text',
      x: 58,
      y: 32 * i + 50,
      text: i + '',
      fill: 'black',
    })
  }
  app.tree.set(json)
  const width = leaferEditor.value.offsetWidth

  app.tree.zoom('fit', 0, true)
  // 监听
  app.tree.on(ZoomEvent.END, function (e: ZoomEvent) {
    // 如果外面的宽度大于当前这个组件的宽度才居中
    if (width > app.tree.children[0].worldBoxBounds.width) {
      // 居中逻辑
      // debugger
      console.log(app.tree.children[0].boxBounds.y)
      console.log(app.tree.children[0].renderBounds.y)
      console.log(app.tree.children[0].worldBoxBounds.y)
      console.log(app.tree.children[0].worldRenderBounds.y)
      app.tree.zoom('fit', 0, true)
    }
  })
}

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
