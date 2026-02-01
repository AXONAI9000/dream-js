# matrix-rain-react

一键将普通页面切换成黑客帝国风格的科技风界面。

## 特性

- 经典黑客帝国风格：黑色背景 + 绿色字符雨
- 扫描线过渡效果
- 心跳脉冲边框动画
- 简单易用的 API

## 安装

```bash
npm install matrix-rain-react
```

## 使用

```tsx
import { MatrixProvider, useMatrix } from 'matrix-rain-react'
import 'matrix-rain-react/styles.css'

function App() {
  return (
    <MatrixProvider>
      <YourApp />
      <ToggleButton />
    </MatrixProvider>
  )
}

function ToggleButton() {
  const { toggle, isActive } = useMatrix()
  return (
    <button onClick={toggle}>
      {isActive ? '关闭科技风' : '开启科技风'}
    </button>
  )
}
```

## API

### MatrixProvider

包裹组件，提供科技风状态管理。

```tsx
<MatrixProvider
  config={{
    rain: { color: '#00ff00', speed: 1.0 },
    scanLine: { duration: 1500 },
    decorator: { pulseSpeed: 1.2 }
  }}
  onActivate={() => console.log('已激活')}
  onDeactivate={() => console.log('已关闭')}
>
  <App />
</MatrixProvider>
```

### useMatrix

获取状态和控制方法的 Hook。

```tsx
const {
  isActive,       // 是否激活
  isTransitioning, // 是否过渡中
  toggle,         // 切换
  activate,       // 激活
  deactivate      // 关闭
} = useMatrix()
```

## License

MIT
