import DrawingBoard from './DrawingBoard'
import type { IAppProps } from './types'

class App {
  static drawingBoardInstance: null | DrawingBoard = null

  // 初始化
  static init = ({ domId, onChange, config = {}, userDefinedData = {} }: IAppProps) => {
    this.drawingBoardInstance = new DrawingBoard({
      domId,
      onChange,
      config,
      userDefinedData,
    })
  }

  // 改变笔刷
  static activeIndexChange(newIndex: number) {
    // 实现方法逻辑
    if (this.drawingBoardInstance) {
      this.drawingBoardInstance.activeIndexChange(newIndex)
    }
  }

  // 撤销
  static historyBack() {
    // 实现方法逻辑
    if (this.drawingBoardInstance) {
      this.drawingBoardInstance.historyBack()
    }
  }

  // 取消撤销
  static historyUnBack() {
    // 实现方法逻辑
    if (this.drawingBoardInstance) {
      this.drawingBoardInstance.historyUnBack()
    }
  }

  // 清空
  static clearData(activeIndex: number) {
    // 实现方法逻辑
    if (this.drawingBoardInstance) {
      this.drawingBoardInstance.clearData()
      this.drawingBoardInstance.activeIndexChange(activeIndex)
    }
  }
  // 下载
  static downLoad() {
    // 实现方法逻辑
    if (this.drawingBoardInstance) {
      this.drawingBoardInstance.downLoad()
    }
  }
  // 卸载
  static destroy() {
    if (this.drawingBoardInstance) {
      this.drawingBoardInstance.destroy()
    }
  }
}

export default App
