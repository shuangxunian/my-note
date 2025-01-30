interface IPageJson {
  pageID: string
  bookID: string
}

export interface IPageType {
  appFill: string
  pageFill: string
  pageType: number
}

export interface IDetailPage {
  pageID: string
  bookID: string
  pageJson: string
  pageNumber: number
  pageType: IPageType
  img: string
}

export interface IPage {
  pageID: string
  bookID: string
  pageNumber: number
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
