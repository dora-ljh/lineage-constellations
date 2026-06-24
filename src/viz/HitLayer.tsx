import { useEffect, useMemo, useRef } from 'react'
import { Delaunay } from 'd3-delaunay'
import type { ScaleLinear } from 'd3-scale'
import type { Node } from '@/types/node'
import type { Adjacency } from '@/graph/adjacency'
import { useAppStore } from '@/state/useAppStore'

interface Props {
  nodes: readonly Node[]
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  adjacency: Adjacency
}

const HIT_R = 20 // px：超出此半径视为未命中

/**
 * 透明 div 覆盖在最上层，pointermove 用 d3-delaunay 找最近节点。
 * rAF 节流；HIT_R 兜底避免远距离误命中。
 */
export function HitLayer({ nodes, xScale, yScale, adjacency }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  // 屏幕坐标 Delaunay，scales 变化时重建
  const delaunay = useMemo(
    () => Delaunay.from(nodes, (n) => xScale(n.x), (n) => yScale(n.y)),
    [nodes, xScale, yScale],
  )

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let lastX = 0
    let lastY = 0
    const HIT_R2 = HIT_R * HIT_R

    const flush = () => {
      raf = 0
      const i = delaunay.find(lastX, lastY)
      if (i < 0 || i >= nodes.length) {
        useAppStore.getState().setHover(null)
        return
      }
      const n = nodes[i]
      const dx = lastX - xScale(n.x)
      const dy = lastY - yScale(n.y)
      useAppStore.getState().setHover(dx * dx + dy * dy < HIT_R2 ? n.id : null)
    }

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      lastX = e.clientX - rect.left
      lastY = e.clientY - rect.top
      if (raf) return
      raf = requestAnimationFrame(flush)
    }

    const onLeave = () => {
      useAppStore.getState().setHover(null)
    }

    const onClick = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const i = delaunay.find(x, y)
      if (i < 0 || i >= nodes.length) {
        useAppStore.getState().clearLock()
        return
      }
      const n = nodes[i]
      const dx = x - xScale(n.x)
      const dy = y - yScale(n.y)
      if (dx * dx + dy * dy >= HIT_R2) {
        useAppStore.getState().clearLock()
        return
      }
      useAppStore.getState().clickNode(n.id, adjacency)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('click', onClick)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('click', onClick)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [delaunay, nodes, xScale, yScale, adjacency])

  return <div ref={ref} className="absolute inset-0 cursor-crosshair" />
}
