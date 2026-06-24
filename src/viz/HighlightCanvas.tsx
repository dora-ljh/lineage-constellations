import { useEffect, useMemo, useRef } from 'react'
import type { ScaleLinear } from 'd3-scale'
import type { Link } from '@/types/link'
import type { Node } from '@/types/node'
import type { Adjacency } from '@/graph/adjacency'
import { clearCanvas, setupHiDPI } from '@/utils/canvas'
import { drawHighlight } from './draw/drawHighlight'
import { useAppStore } from '@/state/useAppStore'

interface Props {
  nodes: readonly Node[]
  links: readonly Link[]
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  adjacency: Adjacency
  width: number
  height: number
  dpr: number
}

export function HighlightCanvas({
  nodes, links, xScale, yScale, adjacency, width, height, dpr,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])

  // (re)setup canvas on size change
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    ctxRef.current = setupHiDPI(canvas, width, height, dpr)
    clearCanvas(ctxRef.current, width, height)
  }, [width, height, dpr])

  // 订阅 store 的 hover/锁定/路径切片，变化时重画。
  // 渐进高亮：hover 命中节点后，revealedDepth 从 0 沿 rAF 涨到 6，逐度展开亲属。
  useEffect(() => {
    // 每度展开时长（毫秒）
    const DEPTH_STEP_MS = 110
    const MAX_DEPTH = 6

    let raf = 0
    let revealStart = 0 // 染色源切换瞬间记录的时间戳
    let lastSourceKey = '' // hover/lock 源 + 路径的 key，用于检测切换

    const draw = (now: number) => {
      raf = 0
      const ctx = ctxRef.current
      if (!ctx) return
      const s = useAppStore.getState()
      // 染色生效源：锁定优先于 hover；hover 不会打断已锁定节点的展开动画
      const effectiveSource = s.lockedSourceId ?? s.hoveredId
      const sourceKey =
        (s.shortestPath ? s.shortestPath.join(',') : '') +
        '|' + (effectiveSource ?? '')
      if (sourceKey !== lastSourceKey) {
        lastSourceKey = sourceKey
        revealStart = now
      }
      const hasSource = effectiveSource || s.shortestPath
      const elapsed = hasSource ? now - revealStart : 0
      const revealedDepth = Math.min(MAX_DEPTH, elapsed / DEPTH_STEP_MS)

      clearCanvas(ctx, width, height)
      drawHighlight(ctx, {
        xScale, yScale, nodeMap, adjacency, links,
        width, height,
        hoveredId: s.hoveredId,
        lockedSourceId: s.lockedSourceId,
        lockedTargetId: s.lockedTargetId,
        shortestPath: s.shortestPath,
        revealedDepth,
      })

      // 还没展开满则继续 rAF
      if (hasSource && revealedDepth < MAX_DEPTH) {
        raf = requestAnimationFrame(draw)
      }
    }
    const schedule = () => {
      if (raf) return
      raf = requestAnimationFrame(draw)
    }
    schedule()
    const unsub = useAppStore.subscribe(
      (s) => [s.hoveredId, s.lockedSourceId, s.lockedTargetId, s.shortestPath] as const,
      schedule,
      { equalityFn: (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] },
    )
    return () => {
      unsub()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [xScale, yScale, nodeMap, adjacency, links, width, height, dpr])

  return <canvas ref={ref} className="pointer-events-none absolute inset-0" />
}
