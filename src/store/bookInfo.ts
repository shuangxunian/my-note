import { defineStore } from 'pinia'
import type { IBook } from '@/types/book'

export const useBookInfoStore = defineStore('bookInfo', {
  state: () => ({
    bookInfo: null as IBook | null,
  }),

  actions: {
    setBookInfo(book: IBook) {
      this.bookInfo = book
      // 同时保存到 localStorage 作为备份
      localStorage.setItem('bookInfo', JSON.stringify(book))
    },

    getBookInfo() {
      if (!this.bookInfo) {
        // 如果 store 中没有，尝试从 localStorage 获取
        const storedBookInfo = localStorage.getItem('bookInfo')
        if (storedBookInfo) {
          this.bookInfo = JSON.parse(storedBookInfo)
        }
      }
      return this.bookInfo
    },

    clearBookInfo() {
      this.bookInfo = null
      localStorage.removeItem('bookInfo')
    },
  },
})
