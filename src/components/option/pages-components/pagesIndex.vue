<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import App from '@/utils/App'
import type { IBook } from '@/types/book'

const stroke = ref<string>('#000000')
const fill = ref<string | null>(null)

const bookInfo = ref<IBook>()
const appFill = ref<string>('#4B3C31')
const pageFill = ref<string>('#fbf0f0')
const pageType = ref<number>(1)
const pageTypeList = [
  {
    value: 0,
    label: '无',
  },
  {
    value: 1,
    label: '横线',
  },
  {
    value: 2,
    label: '网格',
  },
]

const appFillChange = () => {
  App.changePageDisposition('appFill', appFill.value)
}

const pageFillChange = () => {
  App.changePageDisposition('pageFill', pageFill.value)
}

const pageTypeChange = () => {
  App.changePageDisposition('pageType', pageType.value)
}

onMounted(() => {
  const storedBookInfo = localStorage.getItem('bookInfo')
  bookInfo.value = JSON.parse(storedBookInfo)
  appFill.value = bookInfo.value.globalType.appFill
  pageFill.value = bookInfo.value.globalType.pageFill
  pageType.value = bookInfo.value.globalType.pageType
})
</script>

<template>
  <div class="pagesIndex">
    <div class="setting">
      <p>页面背景</p>
      <div class="picker">
        <el-color-picker v-model="appFill" @change="appFillChange" />
      </div>
    </div>
    <div class="setting">
      <p>纸张背景</p>
      <div class="picker">
        <el-color-picker v-model="pageFill" @change="pageFillChange" />
      </div>
    </div>
    <div class="setting">
      <p>纸张样式</p>
      <div class="picker">
        <el-select v-model="pageType" placeholder="请选择样式" @change="pageTypeChange">
          <el-option
            v-for="item in pageTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- <el-color-picker v-model="fill" @change="fillColorChange" /> -->
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.pagesIndex {
  width: calc(100%-20px);
  height: calc(100% -24px);
  padding: 10px 12px;
  font-size: 14px;
  color: #666;
  line-height: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  .setting {
    .slider {
      margin: 0 10px;
    }
    .picker {
      margin-top: 6px;
    }
  }
}
</style>
