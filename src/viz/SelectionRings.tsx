import { useEffect, useState } from 'react'
import type { ScaleLinear } from 'd3-scale'
import type { Node } from '@/types/node'
import { useAppStore } from '@/state/useAppStore'

interface Props {
  nodes: readonly Node[]
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
}

const RING_RADIUS = 14
const RING_STROKE = '#c6e2e7'

/**
 * 选中节点周围的虚线旋转圆环。
 * - 锁定起点（lockedSourceId）显示一个
 * - 路径态时起终点（lockedSourceId & lockedTargetId）各显示一个
 * 旋转动画由 CSS keyframes（.selection-ring）驱动，节点级 SVG 元素免重渲。
 */
export function SelectionRings({ nodes, xScale, yScale }: Props) {
  const [sourceId, setSourceId] = useState<string | null>(
    () => useAppStore.getState().lockedSourceId,
  )
  const [targetId, setTargetId] = useState<string | null>(
    () => useAppStore.getState().lockedTargetId,
  )

  useEffect(
    () => useAppStore.subscribe((s) => s.lockedSourceId, setSourceId),
    [],
  )
  useEffect(
    () => useAppStore.subscribe((s) => s.lockedTargetId, setTargetId),
    [],
  )

  const ids = [sourceId, targetId].filter((id): id is string => Boolean(id))
  if (ids.length === 0) return null

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full">
      {ids.map((id) => {
        const n = nodes.find((nd) => nd.id === id)
        if (!n) return null
        const cx = xScale(n.x)
        const cy = yScale(n.y)
        return (
          <circle
            key={id}
            className="selection-ring"
            cx={cx}
            cy={cy}
            r={RING_RADIUS}
            fill="none"
            stroke={RING_STROKE}
            strokeWidth={1.4}
            strokeDasharray="4 4"
            strokeOpacity={0.85}
          />
        )
      })}
    </svg>
  )
}
