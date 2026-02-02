import type { ScanLineConfig } from '../types'

interface ScanLineProps {
  config: ScanLineConfig
  isTransitioning: boolean
  scanProgress: number // 0-100 百分比
}

export function ScanLine({ config, isTransitioning, scanProgress }: ScanLineProps) {
  const {
    lineHeight = 4,
    glowSize = 20,
    color = '#00ff00'
  } = config

  if (!isTransitioning) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        height: `${lineHeight}px`,
        backgroundColor: color,
        boxShadow: `0 0 ${glowSize}px ${color}, 0 0 ${glowSize * 2}px ${color}`,
        zIndex: 9999,
        top: `${scanProgress}%`,
        transform: 'translateY(-50%)',
        pointerEvents: 'none'
      }}
    />
  )
}
