<script setup lang="ts">
import { onMounted } from 'vue'
import { App } from 'leafer-editor'

interface LeaferChild {
  tag: string
  x: number
  y: number
  width: number
  height: number
  fill: string
  editable: boolean
}

interface LeaferJson {
  fill: string
  type: string
  children: LeaferChild[]
}

const buildLeafer = () => {
  const app = new App({
    view: 'leafer-editor',
    height: 1056,
    width: 816,
    type: 'viewport',
    tree: {},
    editor: {},
  })

  const json: LeaferJson = {
    fill: '#fbf0f0',
    type: 'viewport',
    children: [],
  }
  for (let i = 0; i < 10; i++) {
    json.children.push({
      tag: 'Rect',
      x: 100 * i,
      y: 100,
      width: 100,
      height: 100,
      fill: '#f00',
      editable: true,
    })
  }
  app.tree.set(json)

  // app.tree = app.addLeafer()
  // app.sky = app.addLeafer({ type: 'draw', usePartRender: false })

  // app.editor = new Editor()
  // app.sky.add(app.editor)
  // const app = new App({
  //   view: 'leafer-editor',
  //   width: 816,
  //   height: 1056,
  //   ground: {},
  //   tree: {}, // 添加 tree 层
  //   sky: {}, // 添加 sky 层
  //   editor: {}, // 会自动创建 editor实例、tree层、sky层
  // })
  // app.tree.add(
  //   Rect.one({ editable: true, fill: '#FEB027', cornerRadius: [20, 0, 0, 20] }, 100, 100),
  // )
  // app.tree.add(
  //   Rect.one({ editable: true, fill: '#FFE04B', cornerRadius: [0, 20, 20, 0] }, 300, 100),
  // )
}

onMounted(() => {
  buildLeafer()
})
</script>

<template>
  <div id="leafer-editor" class="leafer-editor"></div>
</template>

<style lang="less" scoped>
.leafer-editor {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
