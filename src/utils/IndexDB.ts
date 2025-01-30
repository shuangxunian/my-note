import type { IBook, IPage, IDetailPage } from '@/types/book'

class IndexDB {
  private static instance: IndexDB | null = null
  private db: IDBDatabase | null = null
  private dbName: string = 'LibraryDB'
  private version: number = 1

  private constructor() {}

  // 单例模式获取实例
  public static getInstance(): IndexDB {
    if (!IndexDB.instance) {
      IndexDB.instance = new IndexDB()
    }
    return IndexDB.instance
  }

  // 初始化数据库
  public async initDB(): Promise<void> {
    if (this.db) return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建 Books 表
        if (!db.objectStoreNames.contains('Books')) {
          const bookStore = db.createObjectStore('Books', { keyPath: 'bookID' })
          bookStore.createIndex('bookName', 'bookName', { unique: false })
        }

        // 创建 Pages 表
        if (!db.objectStoreNames.contains('Pages')) {
          const pageStore = db.createObjectStore('Pages', { keyPath: 'pageID' })
          pageStore.createIndex('bookID', 'bookID', { unique: false })
          pageStore.createIndex('pageID', 'pageID', { unique: false })
        }
      }

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        resolve()
      }

      request.onerror = () => {
        reject(new Error('数据库打开失败'))
      }
    })
  }

  // 添加书籍
  public async addBook(book: IBook): Promise<void> {
    await this.initDB()
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'))
        return
      }

      const transaction = this.db.transaction(['Books'], 'readwrite')
      const store = transaction.objectStore('Books')
      const request = store.add(book)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('添加书籍失败'))
    })
  }

  // 获取所有书籍
  public async getAllBooks(): Promise<IBook[]> {
    await this.initDB()
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'))
        return
      }

      const transaction = this.db.transaction(['Books'], 'readonly')
      const store = transaction.objectStore('Books')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error('获取书籍失败'))
    })
  }

  // 更新书籍
  public async updateBook(book: IBook): Promise<void> {
    await this.initDB()
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'))
        return
      }

      const transaction = this.db.transaction(['Books'], 'readwrite')
      const store = transaction.objectStore('Books')
      const request = store.put(book)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('更新书籍失败'))
    })
  }

  // 删除书籍
  public async deleteBook(bookID: string): Promise<void> {
    await this.initDB()
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'))
        return
      }

      const transaction = this.db.transaction(['Books'], 'readwrite')
      const store = transaction.objectStore('Books')
      const request = store.delete(bookID)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('删除书籍失败'))
    })
  }

  // 获取当前笔记全部页面
  public async getAllPage(bookID: string): Promise<IPage[]> {
    await this.initDB()
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'))
        return
      }

      const transaction = this.db.transaction(['Pages'], 'readonly')
      const store = transaction.objectStore('Pages')
      const index = store.index('bookID')
      const request = index.getAll(bookID)

      request.onsuccess = () => {
        resolve(request.result || [])
      }
      request.onerror = () => reject(new Error('获取页面失败'))
    })
  }

  // 获取当前笔记指定页面 带页面固定数据
  public async getDetailPage(pageID: string): Promise<IPage[]> {
    await this.initDB()
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'))
        return
      }

      const transaction = this.db.transaction(['Pages'], 'readonly')
      const store = transaction.objectStore('Pages')
      const index = store.index('pageID')
      const request = index.getAll(pageID)

      request.onsuccess = () => {
        resolve(request.result || [])
      }
      request.onerror = () => reject(new Error('获取页面失败'))
    })
  }

  // 添加页面
  public async addDetailPage(data): Promise<void> {
    await this.initDB()
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'))
        return
      }

      const transaction = this.db.transaction(['Pages'], 'readwrite')
      const store = transaction.objectStore('Pages')
      const request = store.add(data)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('添加页面失败'))
    })
  }
  // 更新页面，删除页面
  // 因为删除的本质就是将当页全部数据更新为空，所以只需要在调用端将参数传空即可
  public async updatePage(page: IDetailPage): Promise<void> {
    await this.initDB()
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'))
        return
      }

      const transaction = this.db.transaction(['Pages'], 'readwrite')
      const store = transaction.objectStore('Pages')
      const request = store.put(page)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('更新页面失败'))
    })
  }
  // 清空一整个数据库
  public async deleteDatabase(): Promise<void> {
    await this.initDB()
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.dbName) // 删除数据库
      request.onsuccess = () => {}
      request.onerror = () => reject(new Error('数据库清空失败'))
    })
  }
}

// 导出单例实例
export const db = IndexDB.getInstance()

// 导出便捷方法
export const addBook = async (book: IBook) => await db.addBook(book)
export const getAllBooks = async () => await db.getAllBooks()
export const updateBook = async (book: IBook) => await db.updateBook(book)
export const deleteBook = async (bookID: string) => await db.deleteBook(bookID)
export const getAllPage = async (bookID: string) => await db.getAllPage(bookID)
export const getDetailPage = async (pageID: string) => await db.getDetailPage(pageID)
export const addDetailPage = async (data) => await db.addDetailPage(data)
export const updatePage = async (page: IDetailPage) => await db.updatePage(page)
export const deletePage = async (page: IDetailPage) => await db.updatePage(page)
export const deleteDatabase = async () => await db.deleteDatabase()
// 默认导出实例
export default db
