<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import LeaferEditor from '@/components/editor/leaferEditor.vue'
import LeaferOption from '@/components/option/leaferOption.vue'
import img from '@/assets/img/default-page.png'
import _ from 'lodash'

import { ElMessage } from 'element-plus'
import type { IBook, IPage, IPageType, IDetailPage } from '@/types/book'
import { getAllPage, getDetailPage, addDetailPage, updatePage } from '@/utils/IndexDB'
import { useBookInfoStore } from '@/store/bookInfo'

const router = useRouter()

const items = [
  'icon-xuanze',
  'icon-bianji',
  'icon-checkbox',
  'icon-yuanxingweixuanzhong',
  'icon-line',
  'icon-bottom',
  'icon-wenzi',
  'icon-rubber',
  'icon-tuozhuai',
]
const activeIndex = ref(0)
const pageList = ref<IPage[]>([])
const leaferEditor = ref<HTMLElement | null>(null)
const leaferOption = ref<HTMLElement | null>(null)
const bookInfoStore = useBookInfoStore()
const bookInfo = ref(bookInfoStore.getBookInfo())
const nowPageIndex = ref<number>(0)
const nowSelectPage = ref<IDetailPage>()
const refreshLeafer = ref(false)

const pageData = computed(() => {
  return pageList.value[nowPageIndex.value]
})

const setActive = (index: number) => {
  activeIndex.value = index
}

const historyBack = () => {
  leaferEditor.value.historyBack()
}

const historyUnBack = () => {
  leaferEditor.value.historyUnBack()
}

const clearData = () => {
  leaferEditor.value.clearData()
}

const downLoad = () => {
  leaferEditor.value.downLoad()
}

const getPageList = async () => {
  try {
    // 确保 bookInfo 存在
    if (!bookInfo.value?.bookID) {
      ElMessage.error('笔记信息不存在')
      router.push('/main')
      return
    }

    const pages = await getAllPage(bookInfo.value.bookID)

    // 计算需要补充的页数
    const needAddCount = bookInfo.value.pageNum - pages.length

    if (needAddCount > 0) {
      // 需要补充页面
      const newPages: IPage[] = Array.from({ length: needAddCount }, (_, index) => ({
        pageID: '',
        bookID: bookInfo.value!.bookID,
        pageNumber: pages.length + index + 1,
        img: img, // 使用默认图片
      }))

      // 更新页面列表
      pageList.value = [...pages, ...newPages]
    } else {
      pageList.value = pages
    }
  } catch (error) {
    console.error('获取页面列表失败:', error)
    ElMessage.error('获取页面列表失败')
  }
}

const backHome = () => {
  router.push('/main')
}

const savePage = async () => {
  const pageJson = await leaferEditor.value.getDataJson()
  activeIndex.value = 0
  refreshLeafer.value = false
  const res = await updatePage({
    ..._.cloneDeep(nowSelectPage.value),
    pageJson: pageJson,
  })
  refreshLeafer.value = true
}

const pageGoto = async (index: number) => {
  await savePage()
  if (index < 0 || index >= pageList.value.length) return
  nowPageIndex.value = index
  getPageData()
}

const getPageData = async () => {
  refreshLeafer.value = true
  const { pageID, bookID } = pageData.value

  if (pageID === '') {
    const pageType = {
      ...bookInfo.value.globalType,
    }
    nowSelectPage.value = {
      pageID: `${bookID}_${nowPageIndex.value}`,
      bookID: bookID,
      pageJson: '',
      pageNumber: nowPageIndex.value,
      pageType: { ...pageType },
      img: img, // 使用默认图片
    }
    pageList.value[nowPageIndex.value] = nowSelectPage.value
    const res = await addDetailPage({
      pageID: `${bookID}_${nowPageIndex.value}`,
      bookID: bookID,
      pageJson: '',
      pageNumber: nowPageIndex.value,
      pageType: { ...pageType },
    })
  } else {
    const res = await getDetailPage(pageID)
    nowSelectPage.value = res[0]
    leaferEditor.value.setDataJson(res[0].pageJson)
  }
}

onMounted(async () => {
  try {
    if (!bookInfo.value) {
      ElMessage.error('笔记信息不存在')
      router.push('/main')
      return
    }
    await getPageList()
    await getPageData()
  } catch (error) {
    console.error('初始化失败:', error)
    ElMessage.error('初始化失败')
    router.push('/main')
  }
})
</script>

<template>
  <div class="book-detail">
    <div class="header">
      <div class="left">
        <el-button @click="backHome">返回</el-button>
      </div>
      <div class="middle">
        <div class="list">
          <div class="each-type">
            <i class="iconfont icon-left-1" @click="historyBack"></i>
          </div>
          <div class="each-type">
            <i class="iconfont icon-right-1-copy" @click="historyUnBack"></i>
          </div>
          <div class="parting-line"></div>
          <div
            v-for="(item, index) in items"
            :key="index"
            :class="['each-type', { active: index === activeIndex }]"
            @click="setActive(index)"
          >
            <i class="iconfont" :class="item"></i>
          </div>
          <div class="parting-line"></div>
          <div class="page-option each-type">
            <i class="iconfont icon-shanchu" @click="clearData"></i>
          </div>
          <div class="page-option each-type">
            <i class="iconfont icon-xiazai" @click="downLoad"></i>
          </div>
        </div>
      </div>
      <div class="right">
        <el-button :disabled="nowPageIndex === 0" @click="pageGoto(nowPageIndex - 1)"
          >上一页</el-button
        >
        <p>第{{ nowPageIndex + 1 }}页</p>
        <el-button
          :disabled="nowPageIndex === pageList.length - 1"
          @click="pageGoto(nowPageIndex + 1)"
          >下一页</el-button
        >
      </div>
    </div>
    <div class="body">
      <el-scrollbar class="page-list">
        <div
          v-for="(item, index) in pageList"
          :key="index"
          class="page-item"
          @click="pageGoto(index)"
        >
          <img class="page" :src="item.img" alt="" />
          <div class="text">第{{ index + 1 }}页</div>
        </div>
      </el-scrollbar>
      <div v-loading="!refreshLeafer" class="page-now">
        <LeaferEditor
          v-if="pageList.length && refreshLeafer"
          ref="leaferEditor"
          :active-index="activeIndex"
          :now-page="nowPageIndex"
          :page-data="pageList[nowPageIndex]"
        />
      </div>
      <div class="page-option">
        <LeaferOption ref="leaferOption" :active-index="activeIndex" />
      </div>
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
    .left {
      width: 188px;
    }
    .middle {
      display: flex;
      // width: calc(100% - 550px);
      gap: 10px;
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
        }
        .parting-line {
          height: 20px;
          border-left: 1px solid #999;
        }
        .each-type.active {
          color: #000; /* 被选中的颜色深一点 */
          background-color: #eee;
          border-radius: 4px; /* 可选：添加圆角 */
        }
        .each-type:hover {
          color: #000; /* 被选中的颜色深一点 */
          background-color: #eee;
          border-radius: 4px; /* 可选：添加圆角 */
        }
      }
    }
    .right {
      width: 338px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      p {
        font-size: 14px;
        color: #666;
      }
    }
  }
  .body {
    height: calc(100% - 61px);
    width: 100%;
    display: flex;
    .page-list {
      width: 200px;
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
      width: 350px;
    }
  }
}
</style>
