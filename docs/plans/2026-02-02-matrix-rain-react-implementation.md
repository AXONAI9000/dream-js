# matrix-rain-react 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建一个 React 组件库，可以一键将普通页面切换成黑客帝国风格的科技风界面。

**Architecture:** 使用 React Context 管理状态，Canvas 渲染字符雨背景，CSS 动画实现扫描线过渡和心跳边框效果。组件库通过 Vite 打包成 ESM 格式。

**Tech Stack:** React 18+, TypeScript, Canvas API, CSS Animations, Vite

---

## Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/index.ts`

**Step 1: 创建 package.json**

```json
{
  "name": "matrix-rain-react",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": ["dist"],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vite-plugin-dts": "^3.7.0"
  }
}
```

**Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "declarationDir": "./dist"
  },
  "include": ["src"]
}
```

**Step 3: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'] })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
```

**Step 4: 创建空的入口文件**

创建 `src/index.ts`:
```typescript
// matrix-rain-react entry point
export {}
```

**Step 5: 安装依赖**

Run: `npm install`
Expected: 依赖安装成功，生成 node_modules 和 package-lock.json

**Step 6: 验证构建**

Run: `npm run build`
Expected: 构建成功，生成 dist 目录

**Step 7: Commit**

```bash
git init
git add .
git commit -m "chore: initialize matrix-rain-react project"
```

---

## Task 2: 类型定义

**Files:**
- Create: `src/types.ts`

**Step 1: 创建类型定义文件**

```typescript
// src/types.ts

export interface MatrixRainConfig {
  color?: string
  fontSize?: number
  speed?: number
  density?: number
  characters?: string
  fadeSpeed?: number
}

export interface ScanLineConfig {
  duration?: number
  lineHeight?: number
  glowSize?: number
  color?: string
}

export interface DecoratorConfig {
  pulseSpeed?: number
  pulseIntensity?: number
  syncPulse?: boolean
}

export interface MatrixConfig {
  rain?: MatrixRainConfig
  scanLine?: ScanLineConfig
  decorator?: DecoratorConfig
}

export interface MatrixContextValue {
  isActive: boolean
  isTransitioning: boolean
  config: MatrixConfig
  toggle: () => void
  activate: () => void
  deactivate: () => void
}

export interface MatrixProviderProps {
  children: React.ReactNode
  config?: MatrixConfig
  onActivate?: () => void
  onDeactivate?: () => void
  onTransitionStart?: () => void
  onTransitionEnd?: () => void
}
```

**Step 2: 更新入口文件导出类型**

更新 `src/index.ts`:
```typescript
export type {
  MatrixRainConfig,
  ScanLineConfig,
  DecoratorConfig,
  MatrixConfig,
  MatrixContextValue,
  MatrixProviderProps
} from './types'
```

**Step 3: 验证构建**

Run: `npm run build`
Expected: 构建成功

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add TypeScript type definitions"
```

---

## Task 3: MatrixContext 和 useMatrix Hook

**Files:**
- Create: `src/hooks/useMatrix.ts`
- Create: `src/context/MatrixContext.tsx`

**Step 1: 创建 MatrixContext**

创建 `src/context/MatrixContext.tsx`:
```typescript
import { createContext } from 'react'
import type { MatrixContextValue } from '../types'

export const MatrixContext = createContext<MatrixContextValue | null>(null)
```

**Step 2: 创建 useMatrix Hook**

创建 `src/hooks/useMatrix.ts`:
```typescript
import { useContext } from 'react'
import { MatrixContext } from '../context/MatrixContext'
import type { MatrixContextValue } from '../types'

export function useMatrix(): MatrixContextValue {
  const context = useContext(MatrixContext)
  if (!context) {
    throw new Error('useMatrix must be used within a MatrixProvider')
  }
  return context
}
```

**Step 3: 更新入口文件**

更新 `src/index.ts`:
```typescript
export type {
  MatrixRainConfig,
  ScanLineConfig,
  DecoratorConfig,
  MatrixConfig,
  MatrixContextValue,
  MatrixProviderProps
} from './types'

export { useMatrix } from './hooks/useMatrix'
export { MatrixContext } from './context/MatrixContext'
```

**Step 4: 验证构建**

Run: `npm run build`
Expected: 构建成功

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add MatrixContext and useMatrix hook"
```

---

## Task 4: MatrixProvider 组件

**Files:**
- Create: `src/components/MatrixProvider.tsx`

**Step 1: 创建 MatrixProvider 组件**

创建 `src/components/MatrixProvider.tsx`:
```typescript
import { useState, useCallback, useMemo } from 'react'
import { MatrixContext } from '../context/MatrixContext'
import type { MatrixProviderProps, MatrixConfig, MatrixContextValue } from '../types'

const defaultConfig: MatrixConfig = {
  rain: {
    color: '#00ff00',
    fontSize: 16,
    speed: 1.0,
    density: 1.0,
    characters: '01',
    fadeSpeed: 0.05
  },
  scanLine: {
    duration: 1500,
    lineHeight: 4,
    glowSize: 20,
    color: '#00ff00'
  },
  decorator: {
    pulseSpeed: 1.2,
    pulseIntensity: 1.0,
    syncPulse: false
  }
}

export function MatrixProvider({
  children,
  config: userConfig,
  onActivate,
  onDeactivate,
  onTransitionStart,
  onTransitionEnd
}: MatrixProviderProps) {
  const [isActive, setIsActive] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const config = useMemo(() => ({
    rain: { ...defaultConfig.rain, ...userConfig?.rain },
    scanLine: { ...defaultConfig.scanLine, ...userConfig?.scanLine },
    decorator: { ...defaultConfig.decorator, ...userConfig?.decorator }
  }), [userConfig])

  const startTransition = useCallback((toActive: boolean) => {
    setIsTransitioning(true)
    onTransitionStart?.()

    setTimeout(() => {
      setIsActive(toActive)
      setIsTransitioning(false)
      onTransitionEnd?.()
      if (toActive) {
        onActivate?.()
      } else {
        onDeactivate?.()
      }
    }, config.scanLine?.duration ?? 1500)
  }, [config.scanLine?.duration, onActivate, onDeactivate, onTransitionStart, onTransitionEnd])

  const toggle = useCallback(() => {
    if (isTransitioning) return
    startTransition(!isActive)
  }, [isActive, isTransitioning, startTransition])

  const activate = useCallback(() => {
    if (isTransitioning || isActive) return
    startTransition(true)
  }, [isActive, isTransitioning, startTransition])

  const deactivate = useCallback(() => {
    if (isTransitioning || !isActive) return
    startTransition(false)
  }, [isActive, isTransitioning, startTransition])

  const value: MatrixContextValue = useMemo(() => ({
    isActive,
    isTransitioning,
    config,
    toggle,
    activate,
    deactivate
  }), [isActive, isTransitioning, config, toggle, activate, deactivate])

  return (
    <MatrixContext.Provider value={value}>
      {children}
    </MatrixContext.Provider>
  )
}
```

**Step 2: 更新入口文件**

更新 `src/index.ts`:
```typescript
export type {
  MatrixRainConfig,
  ScanLineConfig,
  DecoratorConfig,
  MatrixConfig,
  MatrixContextValue,
  MatrixProviderProps
} from './types'

export { useMatrix } from './hooks/useMatrix'
export { MatrixContext } from './context/MatrixContext'
export { MatrixProvider } from './components/MatrixProvider'
```

**Step 3: 验证构建**

Run: `npm run build`
Expected: 构建成功

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add MatrixProvider component with state management"
```

---

## Task 5: CSS 样式 - 心跳动画和科技装饰

**Files:**
- Create: `src/styles/matrix.css`

**Step 1: 创建 CSS 样式文件**

创建 `src/styles/matrix.css`:
```css
/* matrix-rain-react styles */

/* 心跳脉冲动画 - 真实心跳节奏 */
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

/* 扫描线动画 */
@keyframes scan-line-move {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100vh);
  }
}

@keyframes scan-line-move-reverse {
  from {
    transform: translateY(100vh);
  }
  to {
    transform: translateY(-100%);
  }
}

/* 基础科技风样式 */
.matrix-active {
  background-color: #000 !important;
  color: #00ff00 !important;
}

.matrix-active * {
  border-color: rgba(0, 255, 0, 0.5);
}

/* 卡片和面板的心跳效果 */
.matrix-active .card,
.matrix-active .panel,
.matrix-active [class*="card"],
.matrix-active [class*="panel"],
.matrix-active [class*="box"],
.matrix-active section,
.matrix-active article {
  background-color: rgba(0, 0, 0, 0.8) !important;
  border: 1px solid rgba(0, 255, 0, 0.5);
  animation: heartbeat-pulse 1.2s ease-in-out infinite;
}

/* 错开动画延迟，让心跳不同步 */
.matrix-active .card:nth-child(2n),
.matrix-active [class*="card"]:nth-child(2n) {
  animation-delay: 0.1s;
}

.matrix-active .card:nth-child(3n),
.matrix-active [class*="card"]:nth-child(3n) {
  animation-delay: 0.2s;
}

.matrix-active .card:nth-child(4n),
.matrix-active [class*="card"]:nth-child(4n) {
  animation-delay: 0.3s;
}

/* 文字发光效果 */
.matrix-active h1,
.matrix-active h2,
.matrix-active h3,
.matrix-active h4,
.matrix-active h5,
.matrix-active h6 {
  color: #00ff00 !important;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.matrix-active p,
.matrix-active span,
.matrix-active div,
.matrix-active li {
  color: #00ff00 !important;
}

/* 按钮样式 */
.matrix-active button,
.matrix-active [class*="btn"] {
  background-color: transparent !important;
  border: 1px solid #00ff00 !important;
  color: #00ff00 !important;
  animation: heartbeat-pulse 1.2s ease-in-out infinite;
}

.matrix-active button:hover,
.matrix-active [class*="btn"]:hover {
  background-color: rgba(0, 255, 0, 0.2) !important;
}

/* 输入框样式 */
.matrix-active input,
.matrix-active textarea,
.matrix-active select {
  background-color: rgba(0, 0, 0, 0.8) !important;
  border: 1px solid rgba(0, 255, 0, 0.5) !important;
  color: #00ff00 !important;
}

.matrix-active input:focus,
.matrix-active textarea:focus,
.matrix-active select:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

/* 表格样式 */
.matrix-active table {
  border-color: rgba(0, 255, 0, 0.5);
}

.matrix-active th,
.matrix-active td {
  border-color: rgba(0, 255, 0, 0.3) !important;
  color: #00ff00 !important;
}

.matrix-active th {
  background-color: rgba(0, 255, 0, 0.1) !important;
}

/* 链接样式 */
.matrix-active a {
  color: #00ff00 !important;
  text-decoration: none;
}

.matrix-active a:hover {
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
}
```

**Step 2: 更新入口文件导入样式**

更新 `src/index.ts`:
```typescript
import './styles/matrix.css'

export type {
  MatrixRainConfig,
  ScanLineConfig,
  DecoratorConfig,
  MatrixConfig,
  MatrixContextValue,
  MatrixProviderProps
} from './types'

export { useMatrix } from './hooks/useMatrix'
export { MatrixContext } from './context/MatrixContext'
export { MatrixProvider } from './components/MatrixProvider'
```

**Step 3: 更新 vite.config.ts 处理 CSS**

更新 `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'] })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        assetFileNames: 'styles[extname]'
      }
    },
    cssCodeSplit: false
  }
})
```

**Step 4: 验证构建**

Run: `npm run build`
Expected: 构建成功，dist 目录包含 styles.css

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add CSS styles with heartbeat animation"
```

---

## Task 6: MatrixRain 字符雨组件

**Files:**
- Create: `src/components/MatrixRain.tsx`

**Step 1: 创建 MatrixRain 组件**

创建 `src/components/MatrixRain.tsx`:
```typescript
import { useRef, useEffect } from 'react'
import type { MatrixRainConfig } from '../types'

interface MatrixRainProps {
  config: MatrixRainConfig
  isActive: boolean
}

interface Drop {
  x: number
  y: number
  speed: number
  chars: string[]
}

export function MatrixRain({ config, isActive }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const dropsRef = useRef<Drop[]>([])

  const {
    color = '#00ff00',
    fontSize = 16,
    speed = 1.0,
    density = 1.0,
    characters = '01',
    fadeSpeed = 0.05
  } = config

  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initDrops()
    }

    const initDrops = () => {
      const columns = Math.floor(canvas.width / fontSize)
      dropsRef.current = []

      for (let i = 0; i < columns * density; i++) {
        dropsRef.current.push({
          x: Math.floor(Math.random() * columns) * fontSize,
          y: Math.random() * canvas.height,
          speed: (0.5 + Math.random() * 0.5) * speed,
          chars: []
        })
      }
    }

    const getRandomChar = () => {
      return characters[Math.floor(Math.random() * characters.length)]
    }

    const draw = () => {
      // 半透明黑色覆盖，产生尾迹效果
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeSpeed})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      dropsRef.current.forEach(drop => {
        // 绘制字符
        const char = getRandomChar()

        // 头部字符 - 最亮
        ctx.fillStyle = '#fff'
        ctx.fillText(char, drop.x, drop.y)

        // 尾部字符 - 渐变绿色
        ctx.fillStyle = color
        ctx.fillText(getRandomChar(), drop.x, drop.y - fontSize)

        // 更暗的尾部
        ctx.fillStyle = `${color}88`
        ctx.fillText(getRandomChar(), drop.x, drop.y - fontSize * 2)

        // 移动
        drop.y += fontSize * drop.speed

        // 重置到顶部
        if (drop.y > canvas.height && Math.random() > 0.975) {
          drop.y = 0
          drop.x = Math.floor(Math.random() * (canvas.width / fontSize)) * fontSize
        }
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    draw()

    // 页面可见性处理
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      } else {
        draw()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, color, fontSize, speed, density, characters, fadeSpeed])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  )
}
```

**Step 2: 更新入口文件**

更新 `src/index.ts`:
```typescript
import './styles/matrix.css'

export type {
  MatrixRainConfig,
  ScanLineConfig,
  DecoratorConfig,
  MatrixConfig,
  MatrixContextValue,
  MatrixProviderProps
} from './types'

export { useMatrix } from './hooks/useMatrix'
export { MatrixContext } from './context/MatrixContext'
export { MatrixProvider } from './components/MatrixProvider'
export { MatrixRain } from './components/MatrixRain'
```

**Step 3: 验证构建**

Run: `npm run build`
Expected: 构建成功

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add MatrixRain canvas component"
```

---

## Task 7: ScanLine 扫描线组件

**Files:**
- Create: `src/components/ScanLine.tsx`

**Step 1: 创建 ScanLine 组件**

创建 `src/components/ScanLine.tsx`:
```typescript
import { useEffect, useState } from 'react'
import type { ScanLineConfig } from '../types'

interface ScanLineProps {
  config: ScanLineConfig
  isTransitioning: boolean
  isActivating: boolean // true = 激活中, false = 关闭中
}

export function ScanLine({ config, isTransitioning, isActivating }: ScanLineProps) {
  const [position, setPosition] = useState(isActivating ? -10 : 110)

  const {
    duration = 1500,
    lineHeight = 4,
    glowSize = 20,
    color = '#00ff00'
  } = config

  useEffect(() => {
    if (isTransitioning) {
      // 开始动画
      requestAnimationFrame(() => {
        setPosition(isActivating ? 110 : -10)
      })
    } else {
      // 重置位置
      setPosition(isActivating ? 110 : -10)
    }
  }, [isTransitioning, isActivating])

  if (!isTransitioning) return null

  return (
    <>
      {/* 扫描线 */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          height: `${lineHeight}px`,
          backgroundColor: color,
          boxShadow: `0 0 ${glowSize}px ${color}, 0 0 ${glowSize * 2}px ${color}`,
          zIndex: 9999,
          top: `${isActivating ? -10 : 110}%`,
          transform: `translateY(${position}vh)`,
          transition: `transform ${duration}ms linear`,
          pointerEvents: 'none'
        }}
      />
      {/* 遮罩层 - 跟随扫描线 */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          top: isActivating ? 0 : 'auto',
          bottom: isActivating ? 'auto' : 0,
          height: `${position}%`,
          backgroundColor: isActivating ? '#000' : 'transparent',
          zIndex: 9998,
          transition: `height ${duration}ms linear`,
          pointerEvents: 'none'
        }}
      />
    </>
  )
}
```

**Step 2: 更新入口文件**

更新 `src/index.ts`:
```typescript
import './styles/matrix.css'

export type {
  MatrixRainConfig,
  ScanLineConfig,
  DecoratorConfig,
  MatrixConfig,
  MatrixContextValue,
  MatrixProviderProps
} from './types'

export { useMatrix } from './hooks/useMatrix'
export { MatrixContext } from './context/MatrixContext'
export { MatrixProvider } from './components/MatrixProvider'
export { MatrixRain } from './components/MatrixRain'
export { ScanLine } from './components/ScanLine'
```

**Step 3: 验证构建**

Run: `npm run build`
Expected: 构建成功

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add ScanLine transition component"
```

---

## Task 8: 整合 MatrixProvider

**Files:**
- Modify: `src/components/MatrixProvider.tsx`

**Step 1: 更新 MatrixProvider 整合所有组件**

更新 `src/components/MatrixProvider.tsx`:
```typescript
import { useState, useCallback, useMemo, useEffect } from 'react'
import { MatrixContext } from '../context/MatrixContext'
import { MatrixRain } from './MatrixRain'
import { ScanLine } from './ScanLine'
import type { MatrixProviderProps, MatrixConfig, MatrixContextValue } from '../types'

const defaultConfig: MatrixConfig = {
  rain: {
    color: '#00ff00',
    fontSize: 16,
    speed: 1.0,
    density: 1.0,
    characters: '01',
    fadeSpeed: 0.05
  },
  scanLine: {
    duration: 1500,
    lineHeight: 4,
    glowSize: 20,
    color: '#00ff00'
  },
  decorator: {
    pulseSpeed: 1.2,
    pulseIntensity: 1.0,
    syncPulse: false
  }
}

export function MatrixProvider({
  children,
  config: userConfig,
  onActivate,
  onDeactivate,
  onTransitionStart,
  onTransitionEnd
}: MatrixProviderProps) {
  const [isActive, setIsActive] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isActivating, setIsActivating] = useState(true)

  const config = useMemo(() => ({
    rain: { ...defaultConfig.rain, ...userConfig?.rain },
    scanLine: { ...defaultConfig.scanLine, ...userConfig?.scanLine },
    decorator: { ...defaultConfig.decorator, ...userConfig?.decorator }
  }), [userConfig])

  // 管理 body 的 class
  useEffect(() => {
    if (isActive) {
      document.body.classList.add('matrix-active')
    } else {
      document.body.classList.remove('matrix-active')
    }
    return () => {
      document.body.classList.remove('matrix-active')
    }
  }, [isActive])

  const startTransition = useCallback((toActive: boolean) => {
    setIsTransitioning(true)
    setIsActivating(toActive)
    onTransitionStart?.()

    setTimeout(() => {
      setIsActive(toActive)
      setIsTransitioning(false)
      onTransitionEnd?.()
      if (toActive) {
        onActivate?.()
      } else {
        onDeactivate?.()
      }
    }, config.scanLine?.duration ?? 1500)
  }, [config.scanLine?.duration, onActivate, onDeactivate, onTransitionStart, onTransitionEnd])

  const toggle = useCallback(() => {
    if (isTransitioning) return
    startTransition(!isActive)
  }, [isActive, isTransitioning, startTransition])

  const activate = useCallback(() => {
    if (isTransitioning || isActive) return
    startTransition(true)
  }, [isActive, isTransitioning, startTransition])

  const deactivate = useCallback(() => {
    if (isTransitioning || !isActive) return
    startTransition(false)
  }, [isActive, isTransitioning, startTransition])

  const value: MatrixContextValue = useMemo(() => ({
    isActive,
    isTransitioning,
    config,
    toggle,
    activate,
    deactivate
  }), [isActive, isTransitioning, config, toggle, activate, deactivate])

  return (
    <MatrixContext.Provider value={value}>
      <MatrixRain config={config.rain!} isActive={isActive || isTransitioning} />
      <ScanLine
        config={config.scanLine!}
        isTransitioning={isTransitioning}
        isActivating={isActivating}
      />
      {children}
    </MatrixContext.Provider>
  )
}
```

**Step 2: 验证构建**

Run: `npm run build`
Expected: 构建成功

**Step 3: Commit**

```bash
git add .
git commit -m "feat: integrate MatrixRain and ScanLine into MatrixProvider"
```

---

## Task 9: 创建演示页面

**Files:**
- Create: `demo/index.html`
- Create: `demo/main.tsx`
- Create: `demo/App.tsx`
- Create: `demo/DemoContent.tsx`

**Step 1: 创建 demo/index.html**

创建 `demo/index.html`:
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>matrix-rain-react Demo</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      background: #f5f5f5;
      transition: background-color 0.3s;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./main.tsx"></script>
</body>
</html>
```

**Step 2: 创建 demo/main.tsx**

创建 `demo/main.tsx`:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**Step 3: 创建 demo/App.tsx**

创建 `demo/App.tsx`:
```typescript
import { MatrixProvider, useMatrix } from '../src'
import DemoContent from './DemoContent'

function ToggleButton() {
  const { toggle, isActive, isTransitioning } = useMatrix()

  return (
    <button
      onClick={toggle}
      disabled={isTransitioning}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 24px',
        fontSize: '16px',
        cursor: isTransitioning ? 'wait' : 'pointer',
        zIndex: 10000,
        borderRadius: '8px',
        border: '2px solid #00ff00',
        background: isActive ? '#000' : '#fff',
        color: isActive ? '#00ff00' : '#000',
        fontWeight: 'bold',
        transition: 'all 0.3s'
      }}
    >
      {isTransitioning ? '切换中...' : isActive ? '关闭科技风' : '开启科技风'}
    </button>
  )
}

export default function App() {
  return (
    <MatrixProvider
      onActivate={() => console.log('科技风已激活')}
      onDeactivate={() => console.log('已恢复普通模式')}
    >
      <ToggleButton />
      <DemoContent />
    </MatrixProvider>
  )
}
```

**Step 4: 创建 demo/DemoContent.tsx**

创建 `demo/DemoContent.tsx`:
```typescript
export default function DemoContent() {
  return (
    <div style={{ padding: '80px 40px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>数据统计</h1>
      <p style={{ marginBottom: '40px', color: '#666' }}>查看您的 API 使用情况</p>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={cardStyle}>
          <div style={{ color: '#888', marginBottom: '8px' }}>请求数</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>93</div>
        </div>
        <div className="card" style={cardStyle}>
          <div style={{ color: '#888', marginBottom: '8px' }}>Token 数</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>3,354,758</div>
        </div>
        <div className="card" style={cardStyle}>
          <div style={{ color: '#888', marginBottom: '8px' }}>费用</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>$1.68</div>
        </div>
        <div className="card" style={cardStyle}>
          <div style={{ color: '#888', marginBottom: '8px' }}>输入 Token 数</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>133,628</div>
        </div>
      </div>

      {/* 表格 */}
      <h2 style={{ marginBottom: '20px' }}>模型使用统计</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f9f9f9' }}>
            <th style={thStyle}>模型名称</th>
            <th style={thStyle}>请求数</th>
            <th style={thStyle}>输入 Token</th>
            <th style={thStyle}>输出 Token</th>
            <th style={thStyle}>总费用</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>claude-haiku-4-5-20251001</td>
            <td style={tdStyle}>63</td>
            <td style={tdStyle}>102,739</td>
            <td style={tdStyle}>5,542</td>
            <td style={tdStyle}>$0.59</td>
          </tr>
          <tr>
            <td style={tdStyle}>claude-opus-4-5-20251101</td>
            <td style={tdStyle}>30</td>
            <td style={tdStyle}>30,889</td>
            <td style={tdStyle}>6,963</td>
            <td style={tdStyle}>$1.08</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  padding: '24px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  border: '1px solid #eee'
}

const thStyle: React.CSSProperties = {
  padding: '16px',
  textAlign: 'left',
  borderBottom: '1px solid #eee'
}

const tdStyle: React.CSSProperties = {
  padding: '16px',
  borderBottom: '1px solid #eee'
}
```

**Step 5: 更新 vite.config.ts 支持 demo**

更新 `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    // 开发模式 - 运行 demo
    return {
      plugins: [react()],
      root: 'demo'
    }
  }

  // 构建模式 - 打包库
  return {
    plugins: [
      react(),
      dts({ include: ['src'] })
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
        fileName: 'index'
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          },
          assetFileNames: 'styles[extname]'
        }
      },
      cssCodeSplit: false
    }
  }
})
```

**Step 6: 运行 demo 验证**

Run: `npm run dev`
Expected: 浏览器打开 demo 页面，点击按钮可以切换科技风

**Step 7: Commit**

```bash
git add .
git commit -m "feat: add demo page for testing"
```

---

## Task 10: 最终测试和文档

**Files:**
- Create: `README.md`

**Step 1: 创建 README.md**

创建 `README.md`:
```markdown
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
```

**Step 2: 最终构建验证**

Run: `npm run build`
Expected: 构建成功，dist 目录包含 index.js, index.d.ts, styles.css

**Step 3: Commit**

```bash
git add .
git commit -m "docs: add README"
```

---

## 完成检查清单

- [ ] Task 1: 项目初始化
- [ ] Task 2: 类型定义
- [ ] Task 3: MatrixContext 和 useMatrix Hook
- [ ] Task 4: MatrixProvider 组件
- [ ] Task 5: CSS 样式 - 心跳动画
- [ ] Task 6: MatrixRain 字符雨组件
- [ ] Task 7: ScanLine 扫描线组件
- [ ] Task 8: 整合 MatrixProvider
- [ ] Task 9: 创建演示页面
- [ ] Task 10: 最终测试和文档
