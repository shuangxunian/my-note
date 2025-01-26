declare module '@/utils/App' {
  interface AppConfig {
    domId: string
    config: {
      toolbar: any[] // 你可以定义更具体的类型
    }
    onChange: (json: any) => void
  }

  // 添加一个类型来描述 selectedGraphics
  interface ISelectedGraphics {
    tag: string
    stroke?: string
    strokeWidth?: number
    [key: string]: any // 其他可能的属性
  }

  interface AppInstance {
    init: (config: AppConfig) => void
    destroy: () => void
    activeIndexChange: (newIndex: number) => void
    historyBack: () => void
    historyUnBack: () => void
    clearData: (activeIndex: number) => void
    downLoad: () => void
    changeDisposition: (type: string, value: string | number) => void
    // 添加这两个新方法的类型定义
    getSelectedGraphics: () => { value: ISelectedGraphics | null }
    onSelectedGraphicsChange: (callback: (value: ISelectedGraphics | null) => void) => void
  }

  const App: AppInstance

  export default App
}
