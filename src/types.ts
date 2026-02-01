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
