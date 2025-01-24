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
  }

  const App: AppInstance

  export default App
}
