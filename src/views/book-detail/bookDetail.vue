<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LeaferEditor from '@/components/editor/leaferEditor.vue'
import img from '@/assets/img/image.png'

interface Page {
  pageID: string
  img: string
}

const router = useRouter()
const items = ['Aim', 'EditPen', 'Plus', 'Minus']
const activeIndex = ref(0)
const pageList = ref<Page[]>([])

const setActive = (index: number) => {
  activeIndex.value = index
}

const getPageList = async () => {
  const data = [
    {
      pageID: '1',
      img: img,
    },
    {
      pageID: '2',
      img: img,
    },
    {
      pageID: '3',
      img: img,
    },
  ]
  pageList.value = data
}

const backHome = () => {
  router.push('/main')
}

onMounted(async () => {
  getPageList()
})
</script>

<template>
  <div class="book-detail">
    <div class="header">
      <div class="left">
        <el-button @click="backHome">返回</el-button>
      </div>
      <div class="list">
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="['each-type', { active: index === activeIndex }]"
          @click="setActive(index)"
        >
          <i class="iconfont icon-bianji"></i>
        </div>
      </div>
      <div class="right">
        <!-- <el-switch v-model="isBlack" active-text="暗黑" inactive-text="雪白" @click="selectTheme" /> -->
        <el-avatar> user </el-avatar>
      </div>
    </div>
    <div class="body">
      <el-scrollbar class="page-list">
        <div v-for="(item, index) in pageList" :key="index" class="page-item">
          <img class="page" :src="item.img" alt="" />
          <div class="text">第{{ index + 1 }}页</div>
        </div>
      </el-scrollbar>
      <div class="page-now">
        <LeaferEditor :active-index="activeIndex" />
      </div>
      <div class="page-option"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.book-detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 40px;
    max-width: 1920px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee; /* 添加边框 */
    .list {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      .each-type {
        height: 18px;
        width: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px 6px;
        font-size: 14px; /* 文字小一点 */
        color: #999; /* 颜色浅一点 */
        cursor: pointer;
        transition: color 0.3s;
      }
      .each-type.active {
        color: #000; /* 被选中的颜色深一点 */
        background-color: #eee;
        // border: 1px solid #333; /* 添加边框 */
        border-radius: 4px; /* 可选：添加圆角 */
      }
    }
  }
  .body {
    height: calc(100% - 61px);
    width: 100%;
    display: flex;
    .page-list {
      min-width: 200px;
      overflow: auto;
      .page-item {
        padding: 0 auto;
        width: 100%;
        height: 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        .page {
          width: 78px;
          height: 111px;
          border-radius: 4px;
          cursor: pointer;
        }
        .text {
          font-size: 14px;
          color: #999;
        }
      }
    }
    .page-now {
      flex: 1;
      min-width: 816px;
    }
    .page-option {
      min-width: 350px;
    }
  }
}
</style>
