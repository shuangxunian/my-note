<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    activeIndex: number
  }>(),
  {
    activeIndex: 0,
  },
)

const items = [
  {
    index: 0,
    name: '工具配置',
    type: 'tool',
  },
  {
    index: 1,
    name: '页面配置',
    type: 'page',
  },
]
const activeOption = ref(0)

const setActive = (index: number) => {
  activeOption.value = index
}

onMounted(async () => {})
</script>

<template>
  <div class="leafer-option">
    <div class="header">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="['each-type', { active: index === activeOption }]"
        @click="setActive(index)"
      >
        <div>{{ item.name }}</div>
      </div>
    </div>
    <el-scrollbar class="body">
      <div>123</div>
    </el-scrollbar>
  </div>
</template>

<style lang="less" scoped>
.leafer-option {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    padding: 4px;
    gap: 4px;
    .each-type {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px 6px;
      font-size: 14px; /* 文字小一点 */
      color: #999; /* 颜色浅一点 */
      cursor: pointer;
      &.active {
        color: #000; /* 被选中的颜色深一点 */
        background-color: #eee;
        border-radius: 4px; /* 可选：添加圆角 */
      }
      &:hover {
        color: #000; /* 被选中的颜色深一点 */
        background-color: #eee;
        border-radius: 4px; /* 可选：添加圆角 */
      }
    }
  }
  .body {
    flex: 1;
    // height: calc(100% -40px);
    overflow: auto;
  }
}
</style>
