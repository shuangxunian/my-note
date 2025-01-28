<script setup lang="ts">
import { ref, onMounted } from 'vue'
import img from '@/assets/img/image.png'
import payImg from '@/assets/img/pay-img.jpg'
import avatar from '@/assets/img/avatar.jpg'
import { useRouter } from 'vue-router'
import { addBook, getAllBooks } from '@/utils/IndexDB'
import { ElMessage } from 'element-plus'
import type { IBook } from '@/types/book'
import UserInfo from './conponents/userInfo.vue'

const isBlack = ref(false)
const items = ['我的', '收藏', '商城']
const activeIndex = ref(0)
const bookList = ref<IBook[]>([])
const buyNoteDialog = ref(false)
const payImgDialog = ref(false)
const userInfoDialog = ref(false)
const router = useRouter()
const form = ref({
  bookName: '未命名笔记',
  pageNum: 50,
  img: img,
  des: '',
})

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
  try {
    const books = await getAllBooks()
    bookList.value = books
  } catch (error) {
    console.error('获取书籍列表失败:', error)
    ElMessage.error('获取书籍列表失败')
  }
}

const handleAddBook = async () => {
  try {
    const newBook = {
      bookID: Date.now().toString(),
      bookName: form.value.bookName,
      pageNum: form.value.pageNum,
      img: form.value.img,
      des: form.value.des,
      globalType: {
        appFill: '#4B3C31',
        pageFill: '#fbf0f0',
        pageType: 1,
      },
    }
    await addBook(newBook)
    bookList.value.push(newBook)
    // ElMessage.success('添加成功')
  } catch (error) {
    ElMessage.error(error)
  }
}

const buyNote = () => {
  buyNoteDialog.value = true
}

// 打开支付
const payImgDialogShow = () => {
  payImgDialog.value = true
}

// 支付完成
const finishPay = async () => {
  ElMessage.success('支付成功，感谢您的支持~')
  payImgDialog.value = false
  buyNoteDialog.value = false
  handleAddBook()
}

// 保存个人信息的修改
const saveUserInfoChange = async () => {
  ElMessage.success('保存成功')
  userInfoDialog.value = false
}

// 跳转到笔记详情页
const toBookDetail = (book) => {
  localStorage.setItem('bookInfo', JSON.stringify(book))
  router.push('/bookDetail')
}

// 跳转到用户信息页
const toUserInfo = () => {
  userInfoDialog.value = true
}

const breakUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/login')
}

onMounted(async () => {
  isBlack.value = localStorage.getItem('theme') === 'dark'
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
        <el-avatar class="user-info" @click="toUserInfo">
          <img :src="avatar" alt="" />
        </el-avatar>
      </div>
    </div>
    <div class="body">
      <div class="book-page">
        <div v-if="activeIndex === 0" class="book-list">
          <div class="each-book">
            <div class="book add-book" @click="buyNote">+</div>
            <div class="text">购买新笔记</div>
          </div>
          <div v-for="book in bookList" :key="book.bookID" class="each-book handle">
            <img class="book" :src="book.img" alt="" @click="toBookDetail(book)" />
            <div class="text">{{ book.bookName }}</div>
          </div>
        </div>
        <div v-else class="book-list">
          <p>离线版本不开放此功能</p>
        </div>
      </div>
    </div>
    <el-dialog v-model="buyNoteDialog" title="购买新笔记" width="500">
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="笔记封面">
          <img class="upload-note-page" :src="form.img" alt="" />
        </el-form-item>
        <el-form-item label="笔记名">
          <el-input v-model="form.bookName" />
        </el-form-item>
        <el-form-item label="页数">
          <el-radio-group v-model="form.pageNum">
            <el-radio :value="50">50</el-radio>
            <el-radio :value="100">100</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.des" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="buyNoteDialog = false">取消</el-button>
          <el-button type="primary" @click="payImgDialogShow">支付</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="payImgDialog" title="付款" width="500">
      <div class="pay-page">
        <p class="pay-text">您需支付：{{ form.pageNum === 50 ? 4 : 8 }}元</p>
        <p class="pay-memo">
          此弹窗是给后续的在线版本支付留入口，离线版请直接点支付完成即可；如您愿意支持我，请在备注中留下您的邮箱，在在线版上线后会送您一定的笔记~
        </p>
        <img class="pay-img" :src="payImg" alt="" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="payImgDialog = false">取消</el-button>
          <el-button type="primary" @click="finishPay">支付完成</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="userInfoDialog" title="个人信息" width="800">
      <UserInfo />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="userInfoDialog = false">关闭</el-button>
          <el-button type="primary" @click="saveUserInfoChange">保存更改</el-button>
        </div>
      </template>
    </el-dialog>
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
      .user-info {
        cursor: pointer;
      }
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
.upload-note-page {
  width: 78px;
  height: 111px;
  border-radius: 4px;
  cursor: pointer;
}
.pay-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  .pay-text {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
  .pay-memo {
  }
  .pay-img {
    width: 300px;
    // height: 111px;
  }
}
</style>
