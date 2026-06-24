import { useEffect, useMemo, useRef } from 'react'
import type { ScaleLinear } from 'd3-scale'
import type { Node } from '@/types/node'
import type { Adjacency } from '@/graph/adjacency'
import { useAppStore } from '@/state/useAppStore'
import { clearCanvas, setupHiDPI } from '@/utils/canvas'
import { drawNodes } from './draw/drawNodes'

interface Props {
  nodes: readonly Node[]
  adjacency: Adjacency
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  width: number
  height: number
  dpr: number
}

export function NodeCanvas({ nodes, adjacency, xScale, yScale, width, height, dpr }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  // 连接度查询：mount 时按 adjacency 算一次
  const degreeOf = useMemo(() => {
    return (id: string) => adjacency.get(id)?.length ?? 0
  }, [adjacency])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    ctxRef.current = setupHiDPI(canvas, width, height, dpr)
  }, [width, height, dpr])

  // 订阅 store：高亮态切换时把所有非高亮节点统一改为 0.3 暖金（暗化背景）
  useEffect(() => {
    const isDimmed = () => {
      const s = useAppStore.getState()
      return Boolean(s.hoveredId || s.lockedSourceId || s.shortestPath)
    }
    const render = () => {
      const ctx = ctxRef.current
      if (!ctx) return
      clearCanvas(ctx, width, height)
      drawNodes(ctx, nodes, { xScale, yScale, degreeOf, dimmed: isDimmed() })
    }
    render()
    const unsub = useAppStore.subscribe(
      (s) => Boolean(s.hoveredId || s.lockedSourceId || s.shortestPath),
      render,
    )
    return unsub
  }, [nodes, xScale, yScale, width, height, dpr, degreeOf])

  return <canvas ref={ref} className="pointer-events-none absolute inset-0" />
}
