export interface IPage {
  pageID: string
  bookID: string
  pageNumber: number
  pageJson: string
  pageType: Record<string, any>
  img: string
}

interface IGlobalType {
  appFill: string
  pageFill: string
  pageType: number
}

export interface IBook {
  bookID: string
  bookName: string
  globalType: IGlobalType
  img: string
  pageNum: number
  des?: string
}
