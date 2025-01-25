<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import App from '@/utils/App'
import { Star } from 'leafer-ui'
import { INITIAL_HEIGHT, INITIAL_WIDTH } from '@/utils/Tools'
import LineSegmentBackgroundColorPlugin from '@/components/plugins/LineSegmentBackgroundColorPlugin'
import FIVE_POINTED_STAR_ICON from '@/assets/svg/wujiaoxing.svg'

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
    // debugger
    App.activeIndexChange(newIndex)
  },
  { immediate: true }, // 立即执行一次
)

const fivePointedStar = {
  icon: FIVE_POINTED_STAR_ICON,
  name: 'fivePointedStar',
  title: '五角星',
  index: 1,
  corners: 5,
  innerRadius: 0.382,
  fill: 'rgb(50,205,121)',
  createdFactory(x, y) {
    return new Star({
      // 这个 name 需要和 config.toolbar 每一项中的 name 一致，否则 menuPlugins 出不来
      name: 'fivePointedStar',
      x,
      y,
      width: INITIAL_WIDTH,
      height: INITIAL_HEIGHT,
      corners: this.corners,
      innerRadius: this.innerRadius,
      fill: this.fill,
      editable: true,
    })
  },

  // 后续可自行扩展
  menuPlugins: [LineSegmentBackgroundColorPlugin],
}

onMounted(() =>
  App.init({
    domId: 'leafer-editor',
    config: {
      // 增加工具栏组件
      toolbar: [
        // 五角星组件
        fivePointedStar,
      ],
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
