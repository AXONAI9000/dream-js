import { useRef, useEffect } from 'react'
import type { MatrixRainConfig } from '../types'

interface MatrixRainProps {
  config: MatrixRainConfig
  isActive: boolean
  clipHeight?: number // 裁剪高度百分比 (0-100)
}

interface Drop {
  x: number
  y: number
  speed: number
  chars: string[]
}

export function MatrixRain({ config, isActive, clipHeight = 100 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const dropsRef = useRef<Drop[]>([])
  const resizeTimeoutRef = useRef<number>()

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

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    // 预计算缓存值，避免每帧重复创建
    const fontStyle = `${fontSize}px monospace`
    const fadeStyle = `rgba(0, 0, 0, ${fadeSpeed})`
    const tailColor = `${color}88`
    const charArray = characters.split('')
    const charLen = charArray.length

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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initDrops()
    }

    // 防抖处理 resize 事件
    const debouncedResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      resizeTimeoutRef.current = window.setTimeout(resizeCanvas, 150)
    }

    const draw = () => {
      const drops = dropsRef.current
      const canvasHeight = canvas.height
      const canvasWidth = canvas.width

      // 半透明黑色覆盖，产生尾迹效果
      ctx.fillStyle = fadeStyle
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      ctx.font = fontStyle

      for (let i = 0, len = drops.length; i < len; i++) {
        const drop = drops[i]
        const char = charArray[(Math.random() * charLen) | 0]

        // 头部字符 - 最亮
        ctx.fillStyle = '#fff'
        ctx.fillText(char, drop.x, drop.y)

        // 尾部字符 - 渐变绿色
        ctx.fillStyle = color
        ctx.fillText(charArray[(Math.random() * charLen) | 0], drop.x, drop.y - fontSize)

        // 更暗的尾部
        ctx.fillStyle = tailColor
        ctx.fillText(charArray[(Math.random() * charLen) | 0], drop.x, drop.y - fontSize * 2)

        // 移动
        drop.y += fontSize * drop.speed

        // 重置到顶部
        if (drop.y > canvasHeight && Math.random() > 0.975) {
          drop.y = 0
          drop.x = ((Math.random() * (canvasWidth / fontSize)) | 0) * fontSize
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    resizeCanvas()
    window.addEventListener('resize', debouncedResize)
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
      window.removeEventListener('resize', debouncedResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
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
        pointerEvents: 'none',
        clipPath: `inset(0 0 ${100 - clipHeight}% 0)`
      }}
    />
  )
}
