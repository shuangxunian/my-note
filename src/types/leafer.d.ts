declare module '@/utils/App' {
  interface AppConfig {
    domId: string
    config: {
      toolbar: any[] // 你可以定义更具体的类型
    }
    onChange: (json: any) => void
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
  }

  const App: AppInstance

  export default App
}
