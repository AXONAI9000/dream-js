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
