import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
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
  // 扫描线位置百分比 (0-100)
  const [scanProgress, setScanProgress] = useState(0)
  const animationRef = useRef<number>()

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
    onTransitionStart?.()

    const duration = config.scanLine?.duration ?? 1500
    const startTime = performance.now()
    const startProgress = toActive ? 0 : 100

    // 使用 requestAnimationFrame 来平滑更新进度
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      if (toActive) {
        setScanProgress(progress * 100)
      } else {
        setScanProgress(100 - progress * 100)
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsActive(toActive)
        setIsTransitioning(false)
        setScanProgress(toActive ? 100 : 0)
        onTransitionEnd?.()
        if (toActive) {
          onActivate?.()
        } else {
          onDeactivate?.()
        }
      }
    }

    setScanProgress(startProgress)
    animationRef.current = requestAnimationFrame(animate)
  }, [config.scanLine?.duration, onActivate, onDeactivate, onTransitionStart, onTransitionEnd])

  // 清理动画
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

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

  // 计算裁剪区域：激活时从上往下扫，关闭时从下往上扫
  const clipHeight = isTransitioning ? scanProgress : (isActive ? 100 : 0)

  return (
    <MatrixContext.Provider value={value}>
      {/* 黑色背景层 - 跟随扫描进度 */}
      {(isTransitioning || isActive) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: `${clipHeight}%`,
            backgroundColor: '#000',
            zIndex: -2,
            pointerEvents: 'none'
          }}
        />
      )}
      {/* 光雨效果 - 被裁剪到扫描线上方 */}
      <MatrixRain
        config={config.rain!}
        isActive={isActive || isTransitioning}
        clipHeight={clipHeight}
      />
      {/* 扫描线 */}
      <ScanLine
        config={config.scanLine!}
        isTransitioning={isTransitioning}
        scanProgress={scanProgress}
      />
      {children}
    </MatrixContext.Provider>
  )
}
