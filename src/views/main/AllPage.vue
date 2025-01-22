<script setup lang="ts">
import { ref, onMounted } from 'vue'
import img from '@/assets/img/image.png'
import { VueDraggable } from 'vue-draggable-plus'
import { useRouter } from 'vue-router'

interface Book {
  bookID: string
  bookName: string
  img: string
}

const isBlack = ref(false)
const items = ['我的', '收藏', '商城']
const activeIndex = ref(0)
const bookList = ref<Book[]>([])
const router = useRouter()

const selectTheme = () => {
  const html = document.documentElement
  if (isBlack.value) {
    html.className = 'dark'
    localStorage.setItem('theme', 'dark')
  } else {
    html.className = ''
    localStorage.setItem('theme', 'light')
  }
}

const setActive = (index: number) => {
  activeIndex.value = index
}

const getBookList = async () => {
  const data = [
    {
      bookID: '1',
      bookName: 'book1',
      img: img,
    },
    {
      bookID: '2',
      bookName: 'book2',
      img: img,
    },
    {
      bookID: '3',
      bookName: 'book3',
      img: img,
    },
  ]
  bookList.value = data
}

const toBookDetail = () => {
  router.push('/bookDetail')
}

const breakUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/login')
}

onMounted(async () => {
  isBlack.value = localStorage.getItem('theme') === 'dark'
  selectTheme()
  getBookList()
})
</script>

<template>
  <div class="all-page">
    <div class="header">
      <div class="left">
        <el-button @click="breakUser">退出</el-button>
      </div>
      <div class="list">
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="['each-type', { active: index === activeIndex }]"
          @click="setActive(index)"
        >
          {{ item }}
        </div>
      </div>
      <div class="right">
        <!-- <el-switch v-model="isBlack" active-text="暗黑" inactive-text="雪白" @click="selectTheme" /> -->
        <el-avatar> user </el-avatar>
      </div>
    </div>
    <div class="body">
      <div class="book-page">
        <VueDraggable ref="el" v-model="bookList" handle=".handle" class="book-list">
          <div class="each-book">
            <div class="book add-book">+</div>
            <div class="text">添加书籍</div>
          </div>
          <div v-for="book in bookList" :key="book.bookID" class="each-book handle">
            <img class="book" :src="book.img" alt="" @click="toBookDetail" />
            <div class="text">{{ book.bookName }}</div>
          </div>
        </VueDraggable>
        <!-- <div v-for="book in bookList" :key="book.bookID" class="each-book">
          <img class="book" :src="book.img" alt="" />
          <div class="text">{{ book.bookName }}</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.all-page {
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
        padding: 4px 6px;
        font-size: 14px; /* 文字小一点 */
        color: #999; /* 颜色浅一点 */
        cursor: pointer;
        transition: color 0.3s;
      }
      .each-type.active {
        color: #333; /* 被选中的颜色深一点 */
        border: 1px solid #333; /* 添加边框 */
        border-radius: 4px; /* 可选：添加圆角 */
      }
    }
    .right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
  }
  .body {
    height: calc(100% - 61px);
    width: 100%;
    .book-page {
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      padding: 10px;
      .book-list {
        width: 100%;
        // height: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        // padding: 10px;
        .each-book {
          width: 100px;
          height: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          .book {
            width: 78px;
            height: 111px;
            border-radius: 4px;
            cursor: pointer;
          }
          .add-book {
            border: 1px solid #666;
            color: #666;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 40px;
          }
          .text {
            font-size: 14px;
            color: #999;
          }
        }
      }
    }
  }
}
</style>
