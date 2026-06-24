import { useEffect, useState } from 'react'

export interface Viewport {
  readonly width: number
  readonly height: number
  readonly dpr: number
}

/**
 * 监听 window resize，输出 CSS 像素尺寸与 devicePixelRatio。
 * DPR 上限锁 2，避免 4K 屏 4× 像素绘制成本爆炸。
 */
export function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>(() => read())
  useEffect(() => {
    let raf = 0
    const onResize = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        setVp(read())
      })
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])
  return vp
}

function read(): Viewport {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: Math.min(window.devicePixelRatio ?? 1, 2),
  }
}
