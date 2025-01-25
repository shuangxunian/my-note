import { App, DragEvent } from 'leafer-ui'
import type { IUIJSONData, IUI } from 'leafer-ui'
import DrawingBoard from './DrawingBoard'
import type { Ref } from 'vue'

export interface IPluginProps {
  drawingBoard: DrawingBoard
}

export interface IToolBarItem {
  icon: string
  name: string
  title: string

  // 组件工具栏位置
  index?: number

  // 禁止移动
  notMove?: boolean

  // 手势图标
  cursor?: string

  // 是否能够移除
  isAfterRemove?: boolean

  // 创建图形工厂函数
  createdFactory?: (x: number, y: number) => IUI

  // 自定义鼠标移动函数
  onMousemove?: (
    e: DragEvent,
    drawingBoard: DrawingBoard,
    point: {
      width: number
      height: number
    },
  ) => void

  // 菜单插件
  menuPlugins?: Array<any>
  strokeWidth?: number
  stroke?: string
  fill?: string
  fontSize?: number
  [key: string]: any
}

export interface IUserDefinedData {
  // 整个组件的宽度
  bodyWidth?: number
}

export interface IAppProps {
  domId: string
  onChange?: (json: IUIJSONData) => void
  activeIndexChange?: (newIndex: number) => void
  config?: {
    // 增加自定义工具栏
    toolbar?: Array<IToolBarItem>
  }
  userDefinedData?: IUserDefinedData
}

export interface ILine {
  tag: 'Line'
  x: number
  y: number
  width: number
  strokeWidth: number
  stroke: string
}
export interface IText {
  tag: 'Text'
  x: number
  y: number
  text: string
  fill: string
}

export interface LineOrText {
  tag: 'Line' | 'Text'
  x: number
  y: number
  width?: number
  height?: number
  strokeWidth?: number
  stroke?: string
  fill?: string
  text?: string
}
