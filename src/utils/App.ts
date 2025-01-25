import DrawingBoard from './DrawingBoard'
import type { IAppProps } from './types'

class App {
  static drawingBoardInstance: null | DrawingBoard = null

  static init = ({ domId, onChange, config = {}, userDefinedData = {} }: IAppProps) => {
    this.drawingBoardInstance = new DrawingBoard({
      domId,
      onChange,
      config,
      userDefinedData,
    })
  }

  static activeIndexChange(newIndex: number) {
    // 实现方法逻辑
    if (this.drawingBoardInstance) {
      this.drawingBoardInstance.activeIndexChange(newIndex)
    }
  }

  static destroy() {
    if (this.drawingBoardInstance) {
      this.drawingBoardInstance.destroy()
    }
  }
}

export default App
