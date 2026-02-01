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
