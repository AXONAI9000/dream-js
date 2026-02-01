# matrix-rain-react 设计文档

## 概述

一个 React 组件库，可以一键将普通页面切换成黑客帝国风格的科技风界面。

**核心特性**：
- 经典黑客帝国风格：黑色背景 + 绿色字符雨（0和1）
- 扫描线过渡效果：绿色扫描线从上往下扫过，扫过区域变成科技风
- 科技装饰：边框心跳脉冲、边角装饰、扫描线叠加
- 简单易用：包裹组件 + toggle 方法

## 整体架构

```
matrix-rain-react/
├── src/
│   ├── components/
│   │   ├── MatrixProvider.tsx   # Context Provider
│   │   ├── MatrixRain.tsx       # Canvas 字符雨
│   │   ├── ScanLine.tsx         # 扫描线动画
│   │   └── index.ts
│   ├── hooks/
│   │   └── useMatrix.ts         # 状态 hook
│   ├── styles/
│   │   └── matrix.css           # 装饰样式 + 心跳动画
│   ├── types.ts                 # TypeScript 类型定义
│   └── index.ts                 # 库入口
├── demo/                        # 演示页面
│   └── App.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 使用方式

```tsx
import { MatrixProvider, useMatrix } from 'matrix-rain-react'

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
  return <button onClick={toggle}>切换科技风</button>
}
```

## 组件设计

### 1. MatrixRain - 字符雨效果

使用 Canvas 绘制，性能最佳。

**核心逻辑**：
- 创建全屏 Canvas，固定在页面最底层（z-index: -1）
- 将屏幕分成若干列（每列约 20px 宽）
- 每列有一个"下落头"，不断向下移动
- 下落时绘制随机字符（0、1、或日文片假名）
- 最新字符是亮绿色，之前的字符逐渐变暗/消失

**配置参数**：
```typescript
interface MatrixRainConfig {
  color?: string        // 主色调，默认 '#00ff00'
  fontSize?: number     // 字符大小，默认 16
  speed?: number        // 下落速度，默认 1.0
  density?: number      // 字符密度，默认 1.0
  characters?: string   // 字符集，默认 '01'
  fadeSpeed?: number    // 尾迹消失速度，默认 0.05
}
```

**性能优化**：
- 使用 `requestAnimationFrame` 控制帧率
- 组件卸载时自动清理动画
- 页面不可见时暂停动画

### 2. ScanLine - 扫描线过渡

**效果**：点击切换后，发光绿色横线从顶部向下扫过，扫过区域变成科技风。

**配置参数**：
```typescript
interface ScanLineConfig {
  duration?: number     // 扫描时间，默认 1500ms
  lineHeight?: number   // 扫描线高度，默认 4px
  glowSize?: number     // 发光范围，默认 20px
  color?: string        // 颜色，默认 '#00ff00'
}
```

**动画流程**：
1. 用户点击 toggle → 触发扫描动画
2. 扫描线从 top: 0 过渡到 top: 100vh
3. 扫描线使用 box-shadow 实现发光
4. 扫描线后面跟着黑色遮罩层
5. 动画完成后，科技风完全激活

**反向切换**：从科技风切回普通模式时，扫描线从下往上扫。

### 3. 科技装饰效果

**边框心跳脉冲**（真实心跳节奏）：
```css
@keyframes heartbeat-pulse {
  0% {
    box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
    border-color: rgba(0, 255, 0, 0.5);
  }
  /* 第一次跳动 */
  14% {
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.9);
    border-color: rgba(0, 255, 0, 1);
  }
  28% {
    box-shadow: 0 0 8px rgba(0, 255, 0, 0.4);
    border-color: rgba(0, 255, 0, 0.6);
  }
  /* 第二次跳动（稍弱） */
  42% {
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
    border-color: rgba(0, 255, 0, 0.9);
  }
  /* 休息期 */
  55%, 100% {
    box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
    border-color: rgba(0, 255, 0, 0.5);
  }
}

.matrix-active .card {
  animation: heartbeat-pulse 1.2s ease-in-out infinite;
}
```

**其他装饰**：
- 边角 L 形装饰（CSS 伪元素）
- 扫描线叠加（半透明水平线）
- 文字变绿色 + 发光阴影

**配置参数**：
```typescript
interface DecoratorConfig {
  pulseSpeed?: number    // 心跳速度，默认 1.2s
  pulseIntensity?: number // 脉冲强度，默认 1.0
  syncPulse?: boolean    // 是否同步跳动，默认 false
}
```

## 状态管理与 API

### MatrixProvider

```tsx
<MatrixProvider
  config={{
    rain: { color: '#00ff00', speed: 1.0 },
    scanLine: { duration: 1500 },
    decorator: { pulseSpeed: 1.2 }
  }}
  onActivate={() => console.log('科技风已激活')}
  onDeactivate={() => console.log('已恢复普通模式')}
  onTransitionStart={() => console.log('过渡开始')}
  onTransitionEnd={() => console.log('过渡结束')}
>
  <App />
</MatrixProvider>
```

### useMatrix Hook

```tsx
const {
  isActive,       // boolean - 当前是否激活科技风
  toggle,         // () => void - 切换状态
  activate,       // () => void - 激活科技风
  deactivate,     // () => void - 关闭科技风
  isTransitioning // boolean - 是否正在过渡动画中
} = useMatrix()
```

### 状态流转

```
普通模式 → 点击toggle → 扫描线动画开始 → 动画结束 → 科技风模式
    ↑                                                    ↓
    ←←←←←←←←←← 点击toggle ← 反向扫描动画 ←←←←←←←←←←←←←←←
```

## 技术栈

- **React 18+** - hooks 和 Context API
- **TypeScript** - 类型安全
- **Canvas API** - 字符雨渲染
- **CSS Animations** - 过渡效果和心跳动画
- **Vite** - 构建工具

## 打包输出

- ESM 格式（现代项目）
- 类型声明文件（.d.ts）
