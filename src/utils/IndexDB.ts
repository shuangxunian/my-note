import type { IBook } from '@/types/book'
export default class IndexDB {
  private dbName: string
  private db: IDBDatabase | null = null

  constructor(dbName: string) {
    this.dbName = dbName
  }

  // 初始化数据库
  public async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, 1)

      request.onerror = () => {
        reject(new Error('数据库打开失败'))
      }

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        // 创建书籍存储对象
        if (!db.objectStoreNames.contains('books')) {
          const store = db.createObjectStore('books', { keyPath: 'bookID' })
          store.createIndex('bookName', 'bookName', { unique: false })
          store.createIndex('img', 'img', { unique: false })
        }
      }
    })
  }

  // 添加书籍
  public async addBook(book: IBook): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'))
        return
      }

      const transaction = this.db.transaction(['books'], 'readwrite')
      const store = transaction.objectStore('books')
      const request = store.add(book)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('添加书籍失败'))
    })
  }

  // 获取所有书籍
  public async getAllBooks(): Promise<IBook[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'))
        return
      }

      const transaction = this.db.transaction(['books'], 'readonly')
      const store = transaction.objectStore('books')
      const request = store.getAll()

      // 在 onsuccess 回调中访问 result
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result)
        } else {
          // 如果没有数据，返回空数组
          resolve([])
        }
      }

      request.onerror = () => {
        reject(new Error('获取书籍失败'))
      }
    })
  }

  // 删除书籍
  public async deleteBook(bookID: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'))
        return
      }

      const transaction = this.db.transaction(['books'], 'readwrite')
      const store = transaction.objectStore('books')
      const request = store.delete(bookID)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('删除书籍失败'))
    })
  }
}
