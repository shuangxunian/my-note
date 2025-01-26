import '@leafer-in/editor'
import '@leafer-in/text-editor'
import '@leafer-in/view'
import '@leafer-in/viewport'
import '@leafer-in/export'
import Tools, { INITIAL_HEIGHT, INITIAL_WIDTH } from './Tools'
import { App, DragEvent, Box, ZoomEvent, Group, Leaf } from 'leafer-ui'
import type { ICursorType, ILeaf, IUIJSONData } from 'leafer-ui'
import { ref, toRef, watch } from 'vue'
import type { Ref } from 'vue'
import { EditorEvent } from '@leafer-in/editor'
import History from './History'
import type { IAppProps, LineOrText, IUserDefinedData } from './types'
import { COLOR, ENUM_LOCAL_KEY, ENUM_LOCAL_VALUE } from './constant'

class DrawingBoard {
  private leaferInstance: null | App = null
  private rootDom: null | HTMLElement = null
  private isSelect = false
  private onChange: (json: IUIJSONData) => void = () => {}
  private userDefinedData: IUserDefinedData = {}
  private history: null | History = null

  public tools: null | Tools = null
  public selectedGraphics: Ref<null | any> = ref(null)
  public clearGraphicsQueue = new Map<ILeaf, ILeaf>()
  public readonly leaferInstanceReadonly: null | App = null
  public pageBox: null | Box = null

  public isSun = ref(
    window.localStorage.getItem(ENUM_LOCAL_KEY.THEME) === ENUM_LOCAL_VALUE.SUN ||
      !window.localStorage.getItem(ENUM_LOCAL_KEY.THEME),
  )

  constructor({ domId, onChange, config, userDefinedData }: IAppProps) {
    this.rootDom = document.getElementById(domId)

    if (!this.rootDom) {
      console.warn('未找到挂载元素！')
      return
    }

    if (onChange) this.onChange = onChange
    if (userDefinedData) this.userDefinedData = userDefinedData

    this.leaferInstance = this.initApp(this.rootDom)
    this.leaferInstanceReadonly = this.leaferInstance
    this.tools = new Tools(config)
    this.history = new History(this.leaferInstance)
    this.initEvent(this.leaferInstance)

    watch(
      () => this.tools.toolbarActiveIndex.value,
      (newValue) => {
        this.setEditorState(!newValue)
        this.setCursor()
      },
    )

    watch(
      () => this.isSun.value,
      (val) => this.onChangeTheme(val),
      {
        immediate: true,
      },
    )
  }

  public activeIndexChange = (activeIndex: number) => {
    if (activeIndex === 8) this.leaferInstance.config.move.drag = true
    else delete this.leaferInstance.config.move.drag
    this.tools.toolbarActiveIndex.value = activeIndex
  }

  private addPage = () => {
    const lineList: LineOrText[] = []
    for (let i = 1; i < 30; i++) {
      lineList.push({
        tag: 'Line',
        x: 58,
        y: 32 * i + 50,
        width: 700,
        strokeWidth: 1,
        stroke: '#999',
      })
    }
    for (let i = 1; i < 30; i++) {
      lineList.push({
        tag: 'Text',
        x: 58,
        y: 32 * i + 50,
        text: i + '',
        fill: 'black',
      })
    }
    const box = new Box({
      x: 0,
      y: 0,
      height: 1056,
      width: 816,
      fill: '#fbf0f0',
      children: lineList,
      overflow: 'hide',
    })

    return box
  }

  private initApp = (view: HTMLElement) => {
    const app = new App({
      view,
      fill: '#4B3C31',
      ground: {
        type: 'design',
      },
      tree: {
        type: 'design',
      },
      editor: {},
      zoom: { min: 1, max: 16 },
      move: { scroll: 'limit' },
    })

    const pageBox = this.addPage()
    const userBox = this.addPage()
    this.pageBox = pageBox
    app.ground.add(pageBox)
    app.tree.add(
      new Group({
        x: 0,
        y: 0,
        children: [userBox],
      }),
    )

    app.ground.zoom('fit', 0, true)
    app.tree.zoom('fit', 0, true)

    // 监听
    app.ground.on(ZoomEvent.END, () => {
      // 如果外面的宽度大于当前这个组件的宽度才居中
      if (this.userDefinedData.bodyWidth > app.ground.children[0].worldBoxBounds.width) {
        // 居中逻辑
        app?.ground.zoom('fit', 0, true)
      }
    })
    // 监听
    app.tree.on(ZoomEvent.END, () => {
      // 如果外面的宽度大于当前这个组件的宽度才居中
      if (this.userDefinedData.bodyWidth > app.tree.children[0].worldBoxBounds.width) {
        // 居中逻辑
        app?.tree.zoom('fit', 0, true)
      }
    })

    return app
  }

  private root: HTMLElement = document.documentElement
  public setIsSun = (v: boolean) => {
    this.isSun.value = v
  }

  private onChangeTheme(val: boolean) {
    // this.leaferInstance.fill = val ? COLOR.WHITE : COLOR.BLACK

    window.localStorage.setItem(
      ENUM_LOCAL_KEY.THEME,
      val ? ENUM_LOCAL_VALUE.SUN : ENUM_LOCAL_VALUE.MOON,
    )

    this.root.style.setProperty('--text-color', val ? COLOR.BLACK : COLOR.WHITE)

    this.root.style.setProperty(
      '--title-box-shadow',
      val ? COLOR.SUN_TITLE_BOX_SHADOW : COLOR.MOON_TITLE_BOX_SHADOW,
    )

    this.tools.setTheme(val)
    this.tools.toolbarActiveIndex.value = 0
    this.selectedGraphics.value = null
  }

  private initEvent = (app: App) => {
    app.on(DragEvent.DOWN, this.mousedown)
    app.on(DragEvent.DRAG, this.mousemove)
    app.on(DragEvent.UP, this.mouseup)
    app.editor.on(EditorEvent.SELECT, this.graphicSelected)
    document.body.addEventListener('keydown', this.onKeyDownEvent)
  }

  public destroy() {
    this.leaferInstance.off(DragEvent.DOWN, this.mousedown)
    this.leaferInstance.off(DragEvent.DRAG, this.mousemove)
    this.leaferInstance.off(DragEvent.UP, this.mouseup)
    this.leaferInstance.editor.off(EditorEvent.SELECT, this.graphicSelected)
    document.body.removeEventListener('keydown', this.onKeyDownEvent)
  }

  onKeyDownEvent = (event: KeyboardEvent) => {
    // 快捷键撤销
    if (event.ctrlKey && event.key === 'z') this.historyBack()

    // 快捷键取消撤销
    if (event.ctrlKey && event.key === 'y') this.historyUnBack()

    // 快捷键删除
    if ((event.ctrlKey && event.key === 'Delete') || event.key === 'Backspace') this.deleteData()
  }

  private mousedown = (e: DragEvent) =>
    this.aop(null, () => {
      if ([8].includes(this.tools.toolbarActiveIndex.value)) return

      const { x, y } = e.getPage()

      const graphics = this.tools.getActiveGraphics()

      const graph = graphics.createdFactory!(x - INITIAL_WIDTH, y - INITIAL_HEIGHT)

      this.selectedGraphics.value = graph
      this.leaferInstance.tree.children[0].children[0].add(graph)
      // this.leaferInstance.tree.add(graph)
    })

  private mousemove = (e: DragEvent) =>
    this.aop(null, () => {
      if (!this.selectedGraphics.value) return

      const graphics = this.tools.getActiveGraphics()

      // 不需要移动
      if (graphics.notMove) return

      const { x, y } = this.selectedGraphics.value

      if (!x || !y) return

      const { x: offsetX, y: offsetY } = e.getPage()
      const [width, height] = [offsetX - x, offsetY - y]

      if (graphics.onMousemove) {
        graphics.onMousemove(e, this, { width, height })
      } else {
        const scaleX = width < 0 ? -1 : 1,
          scaleY = height < 0 ? -1 : 1

        this.selectedGraphics.value.scaleX = scaleX
        this.selectedGraphics.value.scaleY = scaleY
        this.selectedGraphics.value.width = Math.abs(width)
        this.selectedGraphics.value.height = Math.abs(height)
      }
    })

  private mouseup = () => {
    if (this.isSelect) return

    if (this.tools.getActiveGraphics().isAfterRemove) {
      this.selectedGraphics.value.remove()
    }

    this.clearGraphicsQueue.forEach((graphics) => {
      graphics.remove()
      this.clearGraphicsQueue.delete(graphics)
    })

    // this.tools.toolbarActiveIndex.value = 0
    this.selectedGraphics.value = null

    const isSave = this.history.save(this.leaferInstance.tree.toJSON())
    if (isSave) {
      this.onChange(this.leaferInstance.tree.toJSON())
    }
  }

  private aop = (beforeHandler, afterHandler) => {
    if (beforeHandler) {
      beforeHandler()
    }

    if (!this.tools.toolbarActiveIndex.value) return

    if (afterHandler) {
      afterHandler()
    }
  }

  public setEditorState = (state: boolean) => {
    this.leaferInstance.editor.cancel()
    this.leaferInstance.editor.hittable = state
    this.leaferInstance.editor.visible = state
  }

  private graphicSelected = ({ value }: any) => {
    if (!value || !value?.tag) {
      this.selectedGraphics.value = null
      this.isSelect = false
      return
    }

    this.isSelect = true

    if (value.tag === 'Pen') {
      value.children[0].name = value.name
      this.selectedGraphics.value = value.children[0]
    } else {
      this.selectedGraphics.value = value
    }
  }

  public setCursor = () => {
    const cursor = (this.tools.getActiveGraphics().cursor || 'crosshair') as ICursorType
    this.leaferInstance.cursor = this.tools.toolbarActiveIndex.value ? cursor : 'auto'
  }

  public getSelectedGraphics = () => {
    return toRef(
      this.selectedGraphics.value ? this.selectedGraphics.value : this.tools.getActiveGraphics(),
    )
  }

  setJson = (json: IUIJSONData | null) => {
    if (!json) return
    this.leaferInstance.tree.set({ children: json.children })
    this.onChange(json)
  }

  historyBack = () => {
    this.setJson(this.history.getBackJson())
  }

  historyUnBack = () => {
    this.setJson(this.history.getUnBackJson())
  }

  deleteData = () => {
    this.selectedGraphics.value.remove()
  }

  clearData = () => {
    this.leaferInstanceReadonly.tree.clear()
    const box = this.addPage()
    this.leaferInstanceReadonly.tree.add(
      new Group({
        x: 0,
        y: 0,
        children: [box],
      }),
    )
  }

  downLoad = () => {
    this.leaferInstanceReadonly.set({
      fill: '',
    })
    this.leaferInstanceReadonly.export('画板.png', { trim: true }).then(() => {
      this.leaferInstanceReadonly.set({
        fill: '#4B3C31',
      })
    })
  }
}

export default DrawingBoard
