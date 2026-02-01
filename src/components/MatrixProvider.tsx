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
